package com.app.backend.config;

import com.app.backend.model.User;
import com.app.backend.model.Category;
import com.app.backend.repository.UserRepository;
import com.app.backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private com.app.backend.repository.SubcategoryRepository subcategoryRepository;

    @Autowired
    private com.app.backend.repository.ProductRepository productRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Ejecutando DataInitializer...");

        //Eliminar y recrear usuarios para asegurar contraseñas correctas
        if (userRepository.existsByUsername("admin")) {
            User existingAdmin = userRepository.findByUsername("admin").orElse(null);
            if (existingAdmin != null) {
                userRepository.delete(existingAdmin);
                System.out.println("Usuario ADMIN existente eliminado");
            }
        }

        if (userRepository.existsByUsername("coordinador")) {
            User existingCoord = userRepository.findByUsername("coordinador").orElse(null);
            if (existingCoord != null) {
                userRepository.delete(existingCoord);
                System.out.println("Usuario COORDINADOR existente eliminado");
            }
        }

        // Crear usuario ADMIN
        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setEmail("admin@app.com");
        admin.setRole(User.Role.ADMIN);
        admin.setActive(true);
        userRepository.save(admin);
        System.out.println("Usuario ADMIN creado - username: admin, password: admin123");

        // Crear usuario COORDINADOR
        User coord = new User();
        coord.setUsername("coordinador");
        coord.setPassword(passwordEncoder.encode("coord123"));
        coord.setEmail("coordinador@app.com");
        coord.setRole(User.Role.COORDINADOR);
        coord.setActive(true);
        userRepository.save(coord);
        System.out.println("Usuario COORDINADOR creado - username: coordinador, password: coord123");

        // Crear categorías por defecto si no existen
        if (!categoryRepository.existsByName("Electrónica")) {
            Category cat1 = new Category();
            cat1.setName("Electrónica");    
            cat1.setDescription("Productos electrónicos y tecnología");
            cat1.setActive(true);
            categoryRepository.save(cat1);
            System.out.println("Categoría creada: Electrónica");
        }

        if (!categoryRepository.existsByName("Ropa")) {
            Category cat2 = new Category();
            cat2.setName("Ropa");
            cat2.setDescription("Vestimenta y accesorios");
            cat2.setActive(true);
            categoryRepository.save(cat2);
            System.out.println("Categoría creada: Ropa");
        }
        // Crear subcategorías por defecto asociadas a Electrónica
        categoryRepository.findByName("Electrónica").ifPresent(elect -> {
            Long catId = elect.getId();
            if (subcategoryRepository.findByCategoryId(catId).isEmpty()) {
                com.app.backend.model.Subcategory sc1 = new com.app.backend.model.Subcategory();
                sc1.setName("Smartphones");
                sc1.setDescription("Teléfonos móviles inteligentes");
                sc1.setActive(true);
                sc1.setCategory(elect);
                subcategoryRepository.save(sc1);

                com.app.backend.model.Subcategory sc2 = new com.app.backend.model.Subcategory();
                sc2.setName("Laptops");
                sc2.setDescription("Computadoras portátiles");
                sc2.setActive(true);
                sc2.setCategory(elect);
                subcategoryRepository.save(sc2);

                System.out.println("Subcategorías creadas para Electrónica: Smartphones, Laptops");
            }
        });

        // Crear productos de ejemplo si no existen
        if (productRepository.count() == 0) {
            categoryRepository.findByName("Electrónica").ifPresent(elect -> {
                subcategoryRepository.findByName("Smartphones").ifPresent(sm -> {
                    com.app.backend.model.Product p1 = new com.app.backend.model.Product();
                    p1.setName("iPhone 15 Pro");
                    p1.setDescription("Smartphone de última generación con chip A17 Pro");
                    p1.setPrice(999.99);
                    p1.setStock(50);
                    p1.setActive(true);
                    p1.setCategory(elect);
                    p1.setSubcategory(sm);
                    productRepository.save(p1);
                    System.out.println("Producto creado: iPhone 15 Pro");
                });

                subcategoryRepository.findByName("Laptops").ifPresent(lp -> {
                    com.app.backend.model.Product p2 = new com.app.backend.model.Product();
                    p2.setName("MacBook Pro 16");
                    p2.setDescription("Laptop profesional con chip M3 Pro");
                    p2.setPrice(2499.99);
                    p2.setStock(25);
                    p2.setActive(true);
                    p2.setCategory(elect);
                    p2.setSubcategory(lp);
                    productRepository.save(p2);
                    System.out.println("Producto creado: MacBook Pro 16");
                });
            });
        }
        System.out.println("DataInitializer completado exitosamente.");
    }

    
}