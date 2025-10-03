package com.sesame.ecommerce.Models.DTO.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductDTO {

    private String name;
    private String description;
    private BigDecimal unitPrice;
    private Integer unitsInStock;
    private boolean active;
    private String imageBase64;
    private String imageContentType;
    private Long categoryId;
    private Long productStatusId;
}
