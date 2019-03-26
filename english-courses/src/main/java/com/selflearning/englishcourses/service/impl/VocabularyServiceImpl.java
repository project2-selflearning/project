package com.selflearning.englishcourses.service.impl;

import com.selflearning.englishcourses.domain.Vocabulary;
import com.selflearning.englishcourses.repository.elasticsearch.VocabularyElasticsearchRepository;
import com.selflearning.englishcourses.repository.elasticsearch.WordClassElasticsearchRepository;
import com.selflearning.englishcourses.repository.elasticsearch.WordElasticsearchRepository;
import com.selflearning.englishcourses.repository.jpa.VocabularyJpaRepository;
import com.selflearning.englishcourses.repository.jpa.WordClassJpaRepository;
import com.selflearning.englishcourses.repository.jpa.WordJpaRepository;
import com.selflearning.englishcourses.service.VocabularyService;
import com.selflearning.englishcourses.service.dto.VocabularyDto;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Iterator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class VocabularyServiceImpl implements VocabularyService {

    private ModelMapper modelMapper;
    private WordJpaRepository wordJpaRepository;
    private WordElasticsearchRepository wordElasticsearchRepository;
    private WordClassJpaRepository wordClassJpaRepository;
    private WordClassElasticsearchRepository wordClassElasticsearchRepository;
    private VocabularyJpaRepository vocabularyJpaRepository;
    private VocabularyElasticsearchRepository vocabularyElasticsearchRepository;

    @Autowired
    public void setModelMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    @Autowired
    public void setWordJpaRepository(WordJpaRepository wordJpaRepository) {
        this.wordJpaRepository = wordJpaRepository;
    }

    @Autowired
    public void setWordElasticsearchRepository(WordElasticsearchRepository wordElasticsearchRepository) {
        this.wordElasticsearchRepository = wordElasticsearchRepository;
    }

    @Autowired
    public void setWordClassJpaRepository(WordClassJpaRepository wordClassJpaRepository) {
        this.wordClassJpaRepository = wordClassJpaRepository;
    }

    @Autowired
    public void setWordClassElasticsearchRepository(WordClassElasticsearchRepository wordClassElasticsearchRepository) {
        this.wordClassElasticsearchRepository = wordClassElasticsearchRepository;
    }

    @Autowired
    public void setVocabularyJpaRepository(VocabularyJpaRepository vocabularyJpaRepository) {
        this.vocabularyJpaRepository = vocabularyJpaRepository;
    }

    @Autowired
    public void setVocabularyElasticsearchRepository(VocabularyElasticsearchRepository vocabularyElasticsearchRepository) {
        this.vocabularyElasticsearchRepository = vocabularyElasticsearchRepository;
    }

    @Override
    public Vocabulary get(String id) {
        return null;
    }

    @Override
    public Vocabulary get(UUID id) {
        return null;
    }

    @Override
    public void save(Vocabulary obj) {

    }

    @Override
    public void saveAll(Iterable<Vocabulary> iterable) {
        vocabularyJpaRepository.saveAll(iterable);
        vocabularyElasticsearchRepository.saveAll(iterable);
    }

    @Override
    public void delete(Vocabulary obj) {

    }

    @Override
    public void deleteAll(Iterable<Vocabulary> iterable) {

    }

    @Override
    public Page<Vocabulary> findAll(Pageable pageable) {
        return null;
    }

    @Override
    public Vocabulary convertDtoToEntity(VocabularyDto vocabularyDto) {
        Vocabulary vocabulary = modelMapper.map(vocabularyDto, Vocabulary.class);
        String id = vocabularyDto.getId();
        if (id != null) {
            vocabulary.setId(UUID.fromString(id));
        }
        return vocabulary;
    }

    @Override
    public List<Vocabulary> convertDtoToEntity(List<VocabularyDto> vocabularyDtos) {
        return vocabularyDtos.stream().map(vocabularyDto -> convertDtoToEntity(vocabularyDto)).collect(Collectors.toList());
    }

    @Override
    public VocabularyDto convertEntityToDto(Vocabulary vocabulary) {
        VocabularyDto vocabularyDto = modelMapper.map(vocabulary, VocabularyDto.class);
        UUID id = vocabulary.getId();
        if (id != null) {
            vocabularyDto.setId(id.toString());
        }
        return vocabularyDto;
    }

    @Override
    public List<VocabularyDto> convertEntityToDto(List<Vocabulary> vocabularies) {
        return vocabularies.stream().map(vocabulary -> convertEntityToDto(vocabulary)).collect(Collectors.toList());
    }

}
