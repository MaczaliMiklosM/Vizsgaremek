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

    /**
     * Visszaadja az adott felhasználó gyűjteményében szereplő összes elemet.
     *
     * @param userId a felhasználó azonosítója
     * @return a felhasználó gyűjteménye (Collection lista formájában)
     */
    public List<Collection> getUserCollection(Integer userId) {
        return collectionRepository.findByUserId(userId);
    }

    /**
     * Elment egy elemet a gyűjteménybe.
     *
     * @param item a menteni kívánt gyűjtemény elem (Collection objektum)
     * @return a mentett elem (amit az adatbázis visszaad)
     */
    public Collection saveToCollection(Collection item) {
        return collectionRepository.save(item);
    }
}
