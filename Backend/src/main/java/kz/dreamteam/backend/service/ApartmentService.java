package kz.dreamteam.backend.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch.indices.CreateIndexRequest;
import co.elastic.clients.transport.endpoints.BooleanResponse;
import co.elastic.clients.util.ObjectBuilder;
import kz.dreamteam.backend.model.Apartment;
import kz.dreamteam.backend.repository.ApartmentsRepository;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.RangeQueryBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.client.elc.NativeQueryBuilder;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class ApartmentService {

    private final ApartmentsRepository apartmentsRepository;

    private final ElasticsearchOperations elasticsearchOperations;

    private final ElasticsearchClient elasticsearchClient;

    public ApartmentService(ApartmentsRepository apartmentsRepository,
                            ElasticsearchOperations elasticsearchOperations, ElasticsearchClient elasticsearchClient) {
        this.apartmentsRepository = apartmentsRepository;
        this.elasticsearchOperations = elasticsearchOperations;
        this.elasticsearchClient = elasticsearchClient;
    }

    public List<Apartment> searchApartments(String query, Integer minRooms, Integer maxRooms, Integer minSize, Integer maxSize) {
        BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();
        if(minRooms == null) minRooms=0;
        if(maxRooms == null) maxRooms=100;
        if(minSize == null) minSize=0;
        if(maxSize == null) maxSize=1000000;

        if (query != null && !query.isEmpty()) {
            boolQuery.must(QueryBuilders.matchQuery("description", query))
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
    public Apartment createApartment(Apartment apartment) {
        return apartmentsRepository.save(apartment);
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
    public Apartment updateApartment(Long id, Apartment updatedApartment) {
        return apartmentsRepository.findById(id)
                .map(apartment -> {
//                    apartment.setOwner(updatedApartment.getOwner());
//                    apartment.setType(updatedApartment.getType());
//                    apartment.setPhoto(updatedApartment.getPhoto());
//                    apartment.setAddress(updatedApartment.getAddress());
//                    apartment.setDescription(updatedApartment.getDescription());
//                    apartment.setCallNumber(updatedApartment.getCallNumber());
//                    apartment.setTelegramNickname(updatedApartment.getTelegramNickname());
//                    apartment.setLinkToKrishaKz(updatedApartment.getLinkToKrishaKz());
                    return apartmentsRepository.save(apartment);
                })
                .orElseThrow(() -> new RuntimeException("Apartment not found with id: " + id));
    }

    // Delete apartment
    public void deleteApartment(Long id) {
        apartmentsRepository.deleteById(id);
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
}
