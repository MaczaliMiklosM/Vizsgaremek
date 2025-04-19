package com.example.demo.services;

import com.example.demo.model.Collection;
import com.example.demo.repository.CollectionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CollectionServiceTest {

    @InjectMocks
    private CollectionService collectionService;

    @Mock
    private CollectionRepository collectionRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetUserCollection() {
        Collection item1 = new Collection();
        Collection item2 = new Collection();
        when(collectionRepository.findByUserId(1)).thenReturn(Arrays.asList(item1, item2));

        List<Collection> result = collectionService.getUserCollection(1);

        assertEquals(2, result.size());
        verify(collectionRepository).findByUserId(1);
    }

    @Test
    void testSaveToCollection() {
        Collection item = new Collection();
        when(collectionRepository.save(item)).thenReturn(item);

        Collection result = collectionService.saveToCollection(item);

        assertNotNull(result);
        assertEquals(item, result);
        verify(collectionRepository).save(item);
    }
}
