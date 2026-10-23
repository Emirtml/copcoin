package com.i2i.cryptopal.repository;

import com.i2i.cryptopal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository

// extends JpaRepository<User, Long> spring bootun bize sunduğu hazır veritabanı fonksiyonları için ( save() findAll() ..) 
public interface UserRepository extends JpaRepository<User, Long> {


    // optional veritabanında böyle biri yoksa çözkmeyi engellemek için
    Optional<User> findByUsername(String username);
}


