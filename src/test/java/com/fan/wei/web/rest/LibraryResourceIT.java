package com.fan.wei.web.rest;

import com.fan.wei.SimpleJhipsterApp;
import com.fan.wei.domain.Library;
import com.fan.wei.repository.LibraryRepository;
import com.fan.wei.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.List;

import static com.fan.wei.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@Link LibraryResource} REST controller.
 */
@SpringBootTest(classes = SimpleJhipsterApp.class)
public class LibraryResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_ADDRESS = "BBBBBBBBBB";

    @Autowired
    private LibraryRepository libraryRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restLibraryMockMvc;

    private Library library;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final LibraryResource libraryResource = new LibraryResource(libraryRepository);
        this.restLibraryMockMvc = MockMvcBuilders.standaloneSetup(libraryResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Library createEntity(EntityManager em) {
        Library library = new Library()
            .name(DEFAULT_NAME)
            .address(DEFAULT_ADDRESS);
        return library;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Library createUpdatedEntity(EntityManager em) {
        Library library = new Library()
            .name(UPDATED_NAME)
            .address(UPDATED_ADDRESS);
        return library;
    }

    @BeforeEach
    public void initTest() {
        library = createEntity(em);
    }

    @Test
    @Transactional
    public void createLibrary() throws Exception {
        int databaseSizeBeforeCreate = libraryRepository.findAll().size();

        // Create the Library
        restLibraryMockMvc.perform(post("/api/libraries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(library)))
            .andExpect(status().isCreated());

        // Validate the Library in the database
        List<Library> libraryList = libraryRepository.findAll();
        assertThat(libraryList).hasSize(databaseSizeBeforeCreate + 1);
        Library testLibrary = libraryList.get(libraryList.size() - 1);
        assertThat(testLibrary.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testLibrary.getAddress()).isEqualTo(DEFAULT_ADDRESS);
    }

    @Test
    @Transactional
    public void createLibraryWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = libraryRepository.findAll().size();

        // Create the Library with an existing ID
        library.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restLibraryMockMvc.perform(post("/api/libraries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(library)))
            .andExpect(status().isBadRequest());

        // Validate the Library in the database
        List<Library> libraryList = libraryRepository.findAll();
        assertThat(libraryList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = libraryRepository.findAll().size();
        // set the field null
        library.setName(null);

        // Create the Library, which fails.

        restLibraryMockMvc.perform(post("/api/libraries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(library)))
            .andExpect(status().isBadRequest());

        List<Library> libraryList = libraryRepository.findAll();
        assertThat(libraryList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkAddressIsRequired() throws Exception {
        int databaseSizeBeforeTest = libraryRepository.findAll().size();
        // set the field null
        library.setAddress(null);

        // Create the Library, which fails.

        restLibraryMockMvc.perform(post("/api/libraries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(library)))
            .andExpect(status().isBadRequest());

        List<Library> libraryList = libraryRepository.findAll();
        assertThat(libraryList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllLibraries() throws Exception {
        // Initialize the database
        libraryRepository.saveAndFlush(library);

        // Get all the libraryList
        restLibraryMockMvc.perform(get("/api/libraries?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(library.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].address").value(hasItem(DEFAULT_ADDRESS.toString())));
    }
    
    @Test
    @Transactional
    public void getLibrary() throws Exception {
        // Initialize the database
        libraryRepository.saveAndFlush(library);

        // Get the library
        restLibraryMockMvc.perform(get("/api/libraries/{id}", library.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(library.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.address").value(DEFAULT_ADDRESS.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingLibrary() throws Exception {
        // Get the library
        restLibraryMockMvc.perform(get("/api/libraries/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateLibrary() throws Exception {
        // Initialize the database
        libraryRepository.saveAndFlush(library);

        int databaseSizeBeforeUpdate = libraryRepository.findAll().size();

        // Update the library
        Library updatedLibrary = libraryRepository.findById(library.getId()).get();
        // Disconnect from session so that the updates on updatedLibrary are not directly saved in db
        em.detach(updatedLibrary);
        updatedLibrary
            .name(UPDATED_NAME)
            .address(UPDATED_ADDRESS);

        restLibraryMockMvc.perform(put("/api/libraries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedLibrary)))
            .andExpect(status().isOk());

        // Validate the Library in the database
        List<Library> libraryList = libraryRepository.findAll();
        assertThat(libraryList).hasSize(databaseSizeBeforeUpdate);
        Library testLibrary = libraryList.get(libraryList.size() - 1);
        assertThat(testLibrary.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testLibrary.getAddress()).isEqualTo(UPDATED_ADDRESS);
    }

    @Test
    @Transactional
    public void updateNonExistingLibrary() throws Exception {
        int databaseSizeBeforeUpdate = libraryRepository.findAll().size();

        // Create the Library

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLibraryMockMvc.perform(put("/api/libraries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(library)))
            .andExpect(status().isBadRequest());

        // Validate the Library in the database
        List<Library> libraryList = libraryRepository.findAll();
        assertThat(libraryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteLibrary() throws Exception {
        // Initialize the database
        libraryRepository.saveAndFlush(library);

        int databaseSizeBeforeDelete = libraryRepository.findAll().size();

        // Delete the library
        restLibraryMockMvc.perform(delete("/api/libraries/{id}", library.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database is empty
        List<Library> libraryList = libraryRepository.findAll();
        assertThat(libraryList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Library.class);
        Library library1 = new Library();
        library1.setId(1L);
        Library library2 = new Library();
        library2.setId(library1.getId());
        assertThat(library1).isEqualTo(library2);
        library2.setId(2L);
        assertThat(library1).isNotEqualTo(library2);
        library1.setId(null);
        assertThat(library1).isNotEqualTo(library2);
    }
}
