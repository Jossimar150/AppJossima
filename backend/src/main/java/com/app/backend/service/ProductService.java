package com.app.backend.service;

import com.app.backend.model.Product;
import com.app.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private com.app.backend.repository.CategoryRepository categoryRepository;

    @Autowired
    private com.app.backend.repository.SubcategoryRepository subcategoryRepository;

    public List<Product> findAll() {
        return productRepository.findAll();
    }

    public List<Product> findByCategoryId(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    public List<Product> findBySubcategoryId(Long subcategoryId) {
        return productRepository.findBySubcategoryId(subcategoryId);
    }

    public Product findById(Long id) {
        return productRepository.findById(id).orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    public Product create(Product product){
        if (product.getCategory() == null || product.getCategory().getId() == null) {
            throw new RuntimeException("Category id is required");
        }
        if (product.getSubcategory() == null || product.getSubcategory().getId() == null) {
            throw new RuntimeException("Subcategory id is required");
        }
        Long categoryId = product.getCategory().getId();
        Long subcategoryId = product.getSubcategory().getId();
        com.app.backend.model.Category categoryEntity = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));
        com.app.backend.model.Subcategory subcategoryEntity = subcategoryRepository.findById(subcategoryId)
                .orElseThrow(() -> new RuntimeException("Subcategory not found with id: " + subcategoryId));

        product.setCategory(categoryEntity);
        product.setSubcategory(subcategoryEntity);
        return productRepository.save(product);
    }

    public Product update(Long id, Product productDetails){
        Product product = findById(id);
        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setStock(productDetails.getStock());
        product.setActive(productDetails.getActive());
        if (productDetails.getCategory() != null && productDetails.getCategory().getId() != null) {
            Long categoryId = productDetails.getCategory().getId();
            com.app.backend.model.Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));
            product.setCategory(category);
        }
        if (productDetails.getSubcategory() != null && productDetails.getSubcategory().getId() != null) {
            Long subcategoryId = productDetails.getSubcategory().getId();
            com.app.backend.model.Subcategory subcategory = subcategoryRepository.findById(subcategoryId)
                .orElseThrow(() -> new RuntimeException("Subcategory not found with id: " + subcategoryId));
            product.setSubcategory(subcategory);
        }
        return productRepository.save(product);
    }

    public void delete(Long id){
        Product product = findById(id);
        productRepository.delete(product);
    }

    public Product toggleActive(Long id) {
        Product product = findById(id);
        product.setActive(!product.getActive()); // Cambiar el estado actual
        return productRepository.save(product);
    }
}


