package com.app.backend.service;

import com.app.backend.model.Subcategory;
import com.app.backend.repository.CategoryRepository;
import com.app.backend.repository.SubcategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SubcategoryService {
    
    @Autowired
    private SubcategoryRepository subcategoryRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Subcategory> findAll() {
        return subcategoryRepository.findAll();
    }

    public List<Subcategory> findByCategoryId(Long categoryId) {
        return subcategoryRepository.findByCategoryId(categoryId);
    }

    public Subcategory findById(Long id) {
        return subcategoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Subcategoria no encontrada"));
    }
    public Subcategory create(Subcategory subcategory){
        if (subcategory.getCategory() == null || subcategory.getCategory().getId() == null) {
            throw new RuntimeException("Category id is required");
        }
        Long categoryId = subcategory.getCategory().getId();
        com.app.backend.model.Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));
        subcategory.setCategory(category);
        return subcategoryRepository.save(subcategory);
    }
    public Subcategory update(Long id, Subcategory subcategoryDetails){
        Subcategory subcategory = findById(id);
        subcategory.setName(subcategoryDetails.getName());
        subcategory.setDescription(subcategoryDetails.getDescription());
        subcategory.setActive(subcategoryDetails.getActive());
        if (subcategoryDetails.getCategory() != null && subcategoryDetails.getCategory().getId() != null) {
            Long categoryId = subcategoryDetails.getCategory().getId();
            com.app.backend.model.Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));
            subcategory.setCategory(category);
        }
        return subcategoryRepository.save(subcategory);
    }
    public void delete(Long id){
        Subcategory subcategory = findById(id);
        subcategoryRepository.delete(subcategory);
    }

    public Subcategory toggleActive(Long id) {
        Subcategory subcategory = findById(id);
        subcategory.setActive(!subcategory.getActive()); // Cambiar el estado actual
        return subcategoryRepository.save(subcategory);
    }
}