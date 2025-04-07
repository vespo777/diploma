package kz.dreamteam.backend.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.indices.CreateIndexRequest;
import co.elastic.clients.transport.endpoints.BooleanResponse;
import com.vladmihalcea.spring.repository.HibernateRepositoryImpl;
import kz.dreamteam.backend.model.Apartment;
import kz.dreamteam.backend.model.User;
import kz.dreamteam.backend.model.dto.ApartmentDTO;
import kz.dreamteam.backend.repository.ApartmentsRepository;
import kz.dreamteam.backend.repository.UserRepository;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ApartmentService {

    private final ApartmentsRepository apartmentsRepository;

    private final ElasticsearchOperations elasticsearchOperations;

    private final ElasticsearchClient elasticsearchClient;

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final JwtService jwtService;


    public ApartmentService(ApartmentsRepository apartmentsRepository,
                            ElasticsearchOperations elasticsearchOperations,
                            ElasticsearchClient elasticsearchClient,
                            UserRepository userRepository,
                            ModelMapper modelMapper, JwtService jwtService) {
        this.apartmentsRepository = apartmentsRepository;
        this.elasticsearchOperations = elasticsearchOperations;
        this.elasticsearchClient = elasticsearchClient;
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
        this.jwtService = jwtService;
    }

    public List<Apartment> searchApartments(String query, Integer minRooms, Integer maxRooms, Integer minSize, Integer maxSize) {
        BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();
        if(minRooms == null) minRooms=0;
        if(maxRooms == null) maxRooms=100;
        if(minSize == null) minSize=0;
        if(maxSize == null) maxSize=1000000;

        if (query != null && !query.isEmpty()) {
            boolQuery.must(QueryBuilders.wildcardQuery("descriptionJunkKeyword.keyword", "*" + query.toLowerCase() + "*"))
                    .filter(QueryBuilders.rangeQuery("roomQuantity").gte(minRooms).lte(maxRooms))
                    .filter(QueryBuilders.rangeQuery("sizeSquareMeter").gte(minSize).lte(maxSize));
        }

        String jsonQuery = boolQuery.toString();
        String encodedQuery = Base64.getEncoder().encodeToString(jsonQuery.getBytes(StandardCharsets.UTF_8));

        NativeQuery searchQuery = NativeQuery.builder()
                .withQuery(q -> q.wrapper(w -> w.query(encodedQuery)))
                .build();


        SearchHits<Apartment> searchHits = elasticsearchOperations.search(searchQuery, Apartment.class);

        return searchHits.stream()
                .map(hit -> hit.getContent())
                .collect(Collectors.toList());
    }

    // Create a new apartment
    public Apartment createApartment(String token, ApartmentDTO apartmentDTO) {

        Long userId = jwtService.getUserIdFromToken(token);

        // Маппим DTO в сущность
        Apartment apartment = modelMapper.map(apartmentDTO, Apartment.class);

        // Устанавливаем userId вручную (возможно, модель не полностью маппится)
        apartment.setUserId(userId);

        // Сохраняем в БД
        Apartment savedApartment = apartmentsRepository.save(apartment);

        // Сохраняем в Elasticsearch
//        saveToElasticsearch(apartment);

        return savedApartment;
    }

    // Get all apartments
    public List<Apartment> getAllApartments() {
        return apartmentsRepository.findAll();
    }

    // Get apartment by ID
    public Optional<Apartment> getApartmentById(Long id) {
        return apartmentsRepository.findById(id);
    }

    // Update apartment
    public Apartment updateApartment(Long id, ApartmentDTO updatedApartmentDto) {

        Apartment apartmentUpd = modelMapper.map(updatedApartmentDto, Apartment.class);


        return apartmentsRepository.findById(id)
                .map(apartment -> {
                    apartment.setTitle(apartmentUpd.getTitle());
                    apartment.setDescription(apartmentUpd.getDescription());
                    apartment.setPrice(apartmentUpd.getPrice());
                    apartment.setPrice(apartmentUpd.getPrice());
                    apartment.setLocation(apartmentUpd.getLocation());
                    apartment.setPhotoPath(apartmentUpd.getPhotoPath());
                    apartment.setAddress(apartmentUpd.getAddress());
                    apartment.setLocation2Gis(apartmentUpd.getLocation2Gis());
                    apartment.setPropertyType(apartmentUpd.getPropertyType());
                    apartment.setFurnished(apartmentUpd.getFurnished());
                    apartment.setInternetIncluded(apartmentUpd.getInternetIncluded());
                    apartment.setUtilitiesIncluded(apartmentUpd.getUtilitiesIncluded());
                    apartment.setPhoneNumber(apartmentUpd.getPhoneNumber());
                    apartment.setPetsAllowed(apartmentUpd.getPetsAllowed());
                    apartment.setParkingAvailable(apartmentUpd.getParkingAvailable());
                    apartment.setLinkToKrishaKz(apartmentUpd.getLinkToKrishaKz());
                    apartment.setRoomQuantity(apartmentUpd.getRoomQuantity());
                    apartment.setSizeSquareMeter(apartmentUpd.getSizeSquareMeter());
                    apartment.generateDescriptionJunk();

                    // Сохраняем обновленную запись в базе данных
                    apartmentsRepository.save(apartment);

                    // Обновляем запись в Elasticsearch
//                    saveToElasticsearch(apartment);

                    return apartment;
                })
                .orElseThrow(() -> new RuntimeException("Apartment not found with id: " + id));
    }

    // Delete apartment
    public void deleteApartment(Long id) {
        // Удаляем из базы данных через JPA
        apartmentsRepository.deleteById(id);

        // Удаляем из Elasticsearch
        deleteFromElasticsearch(id);
    }

    public void createIndexIfNotExists(String indexName) {
        try {
            BooleanResponse existsResponse = elasticsearchClient.indices().exists(e -> e.index(indexName));
            if (!existsResponse.value()) {
                elasticsearchClient.indices().create(CreateIndexRequest.of(c -> c.index(indexName)));
                System.out.println("Index " + indexName + " created successfully.");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void saveToElasticsearch(Apartment apartment) {
        try {
            elasticsearchClient.index(i -> i
                    .index("apartments")
                    .id(apartment.getApartmentId().toString())
                    .document(apartment)
            );
        } catch (IOException e) {
            throw new RuntimeException("Ошибка при сохранении в Elasticsearch", e);
        }
    }

    public void deleteFromElasticsearch(Long id) {
        try {
            boolean indexExists = elasticsearchClient.indices().exists(i -> i.index("apartments")).value();
            if (!indexExists) {
                throw new RuntimeException("Индекс apartments не существует!");
            }

            elasticsearchClient.delete(d -> d
                    .index("apartments")
                    .id(id.toString())
            );
        } catch (IOException e) {
            throw new RuntimeException("Ошибка при удалении из Elasticsearch", e);
        }
    }




}
