package com.sesame.ecommerce.Service.implSecurity;

import com.sesame.ecommerce.Models.ProductStatus;
import com.sesame.ecommerce.Repositories.ProductStatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductStatusServiceImpl {

    private final ProductStatusRepository productStatusRepository;

    public List<ProductStatus> getProductStatusList() {
        return productStatusRepository.findAll();
    }

    public ProductStatus saveProductStatus(ProductStatus productStatus) {
        return productStatusRepository.save(productStatus);
    }
}
