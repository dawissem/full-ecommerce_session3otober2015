package com.sesame.ecommerce.Repositories;

import com.sesame.ecommerce.Models.Product;
import com.sesame.ecommerce.Models.ProductCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByProductStatusId(Long id, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.productStatus.id = ?1 ORDER BY RAND() LIMIT 4")
    List<Product> findByProductStatusIdLimit(Long id);

    Page<Product> findByNameContaining(String name, Pageable pageable);

    @Query(
            "SELECT p FROM Product p WHERE p.category.id = ?1  ORDER BY RAND() LIMIT 4"
            )
    List<Product> findByCategoryIdLimit(Long id);
}
