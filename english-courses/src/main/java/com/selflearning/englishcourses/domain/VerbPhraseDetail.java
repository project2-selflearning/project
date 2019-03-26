package com.selflearning.englishcourses.domain;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * @author manhnd
 * @version 1.0
 */
@Getter
@Setter
@ToString
@EqualsAndHashCode
@Entity
@Table(name="verb_phrase_details")
@Document(indexName = "verb_phrase_details", shards = 2)
public class VerbPhraseDetail {

    @Id
    @GenericGenerator(name="uuid", strategy = "uuid2")
    @GeneratedValue(generator = "uuid")
    @Column(name = "VERB_PHRASE_DETAIL_ID", length = 16)
    private UUID id;

    @ManyToOne
    @JoinColumn(name="VERB_PHRASE_ID", nullable = false)
    private VerbPhrase verbPhrase;

    @Column(name="VERB_PHRASE_DESCRIPTION")
    private String description;

    @Column(name="VERB_PHRASE_MEANING")
    private String meaning;

    @Column(name="VERB_PHRASE_SYNONYMS", length = 500)
    private String synonyms;

    @Column(name="VERB_PHRASE_NOTE")
    private String note;

}
