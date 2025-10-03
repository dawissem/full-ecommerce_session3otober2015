package com.sesame.ecommerce.Repositories;

import com.sesame.ecommerce.Models.ProductStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductStatusRepository extends JpaRepository<ProductStatus,Long> {
}
