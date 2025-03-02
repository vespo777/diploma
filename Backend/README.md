# Spring Boot JWT Authorization API
🚀 Overview
This is a Spring Boot REST API that implements JWT-based authentication and authorization. It allows users to register, log in, and access protected resources based on roles.

📌 Features  
✅ User registration & login   
✅ JWT-based authentication  
✅ Role-based access control (RBAC)  
✅ Spring Security integration  
✅ Refresh token support

🛠️ Tech Stack  
Spring Boot (REST API)  
Spring Security (authentication & authorization)  
JWT (JSON Web Tokens)  
PostgreSQL (database)  
Hibernate (JPA)  
Maven (build tool)  

⚙️ Installation & Setup  
1️⃣ Clone the repository  
    git clone https://github.com/your-username/spring-boot-jwt-auth.git  
    cd spring-boot-jwt-auth  
2️⃣ Configure the database    
Update application.properties (or application.yml) with your PostgreSQL/MySQL settings:

properties  
spring.datasource.url=jdbc:postgresql://localhost:5432/jwt_db
spring.datasource.username=your_db_user
spring.datasource.password=your_db_password  
3️⃣ Run the application  
mvn spring-boot:run  