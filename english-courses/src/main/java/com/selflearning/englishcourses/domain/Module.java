package com.selflearning.englishcourses.domain;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import java.util.List;
import java.util.UUID;

/**
 * @author manhnd
 * @version 1.0
 */
@Getter
@Setter
@ToString(exclude = "lessonModules")
@EqualsAndHashCode(exclude = "lessonModules")
@Entity
@Table(name="modules")
@Document(indexName = "modules", shards = 2)
public class Module {

    @Id
    @GenericGenerator(name="uuid", strategy = "uuid2")
    @GeneratedValue(generator = "uuid")
    @Column(name = "MODULE_ID", length = 16)
    private UUID id;

    @Column(name="MODULE_NAME", nullable = false, unique = true)
    private String name;

    @OneToMany(mappedBy = "module")
    private List<LessonModule> lessonModules;

}
