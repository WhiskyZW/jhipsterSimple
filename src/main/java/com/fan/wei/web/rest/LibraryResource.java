package com.fan.wei.web.rest;

import com.fan.wei.domain.Library;
import com.fan.wei.repository.LibraryRepository;
import com.fan.wei.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * REST controller for managing {@link com.fan.wei.domain.Library}.
 */
@RestController
@RequestMapping("/api")
public class LibraryResource {

    private final Logger log = LoggerFactory.getLogger(LibraryResource.class);

    private static final String ENTITY_NAME = "library";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LibraryRepository libraryRepository;

    public LibraryResource(LibraryRepository libraryRepository) {
        this.libraryRepository = libraryRepository;
    }

    /**
     * {@code POST  /libraries} : Create a new library.
     *
     * @param library the library to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new library, or with status {@code 400 (Bad Request)} if the library has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/libraries")
    public ResponseEntity<Library> createLibrary(@Valid @RequestBody Library library) throws URISyntaxException {
        log.debug("REST request to save Library : {}", library);
        if (library.getId() != null) {
            throw new BadRequestAlertException("A new library cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Library result = libraryRepository.save(library);
        return ResponseEntity.created(new URI("/api/libraries/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /libraries} : Updates an existing library.
     *
     * @param library the library to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated library,
     * or with status {@code 400 (Bad Request)} if the library is not valid,
     * or with status {@code 500 (Internal Server Error)} if the library couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/libraries")
    public ResponseEntity<Library> updateLibrary(@Valid @RequestBody Library library) throws URISyntaxException {
        log.debug("REST request to update Library : {}", library);
        if (library.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Library result = libraryRepository.save(library);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, library.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /libraries} : get all the libraries.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of libraries in body.
     */
    @GetMapping("/libraries")
    public List<Library> getAllLibraries(@RequestParam(required = false) String filter) {
        if ("admin-is-null".equals(filter)) {
            log.debug("REST request to get all Librarys where admin is null");
            return StreamSupport
                .stream(libraryRepository.findAll().spliterator(), false)
                .filter(library -> library.getAdmin() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all Libraries");
        return libraryRepository.findAll();
    }

    /**
     * {@code GET  /libraries/:id} : get the "id" library.
     *
     * @param id the id of the library to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the library, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/libraries/{id}")
    public ResponseEntity<Library> getLibrary(@PathVariable Long id) {
        log.debug("REST request to get Library : {}", id);
        Optional<Library> library = libraryRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(library);
    }

    /**
     * {@code DELETE  /libraries/:id} : delete the "id" library.
     *
     * @param id the id of the library to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/libraries/{id}")
    public ResponseEntity<Void> deleteLibrary(@PathVariable Long id) {
        log.debug("REST request to delete Library : {}", id);
        libraryRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
