package com.example.demo.services;

import com.example.demo.model.Collection;
import com.example.demo.repository.CollectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CollectionService {
    @Autowired
    CollectionRepository collectionRepository;

    public List<Collection> getUserCollection(Integer userId) {
        return collectionRepository.findByUserId(userId);
    }

    public Collection saveToCollection(Collection item) {
        return collectionRepository.save(item);
    }
}
