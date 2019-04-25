package com.selflearning.englishcourses.controller.rest.v1;

import com.selflearning.englishcourses.domain.*;
import com.selflearning.englishcourses.service.CourseService;
import com.selflearning.englishcourses.service.LessonModuleService;
import com.selflearning.englishcourses.service.ModuleService;
import com.selflearning.englishcourses.service.dto.LessonModuleDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@RequiredArgsConstructor(onConstructor_ = @Autowired)
@RestController
@RequestMapping("/api/v1")
public class LessonModuleRestController {

    private final LessonModuleService lessonModuleService;

    private final CourseService courseService;

    @Transactional
    @PostMapping("/lesson-modules")
    public ResponseEntity<LessonModuleDto> createLessonModule(@Valid @RequestBody LessonModuleDto lessonModuleDto) {
        LessonModule lessonModule = lessonModuleService.convertDtoToEntity(lessonModuleDto);
        Module module = lessonModule.getModule();
        switch (module.getName()) {
            case "Luyện từ vựng":
                VocabularyLesson vocabularyLesson = new VocabularyLesson();
                vocabularyLesson.setLessonModule(lessonModule);
                lessonModule.setVocabularyLesson(vocabularyLesson);
                lessonModuleService.save(lessonModule);
                break;
            case "Luyện ngữ pháp":
                GrammarLesson grammarLesson = new GrammarLesson();
                grammarLesson.setLessonModule(lessonModule);
                lessonModule.setGrammarLesson(grammarLesson);
                lessonModuleService.save(lessonModule);
                break;
            default:
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(lessonModuleService.convertEntityToDto(lessonModule), HttpStatus.CREATED);
    }

    @PostMapping("/lesson-modules/{lessonModuleId}/mark")
    public ResponseEntity<Float> createLessonModuleMark(
            @PathVariable("lessonModuleId") UUID lessonModuleId,
            @RequestBody LessonModuleMark lessonModuleMark, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        LessonModule lessonModule = lessonModuleService.get(lessonModuleId);
        UserCourse userCourse = courseService.getUserCourseByCourseIdAndUserId(lessonModule.getLesson().getCourse().getId(), user.getId());
        lessonModuleMark.setUserCourse(userCourse);
        lessonModuleService.createLessonModuleMark(lessonModuleMark);
        return new ResponseEntity<>(lessonModuleMark.getMark(), HttpStatus.CREATED);
    }

    @DeleteMapping("/lesson-modules/{id}")
    public ResponseEntity<Void> deleteLessonModule(@PathVariable("id") UUID id) {
        lessonModuleService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
