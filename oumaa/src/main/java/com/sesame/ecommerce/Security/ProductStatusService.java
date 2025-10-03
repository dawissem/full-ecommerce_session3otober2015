package com.sesame.ecommerce.Security;

import com.sesame.ecommerce.Models.ProductStatus;
import org.springframework.stereotype.Service;

import java.util.List;

public interface ProductStatusService {
    List<ProductStatus> getProductStatusList();
    ProductStatus saveProductStatus(ProductStatus productStatus);
}
