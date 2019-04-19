$(document).ready(function () {
    var courseTab = document.getElementById('course-tab');
    var table = undefined;
    var pagination = undefined;
    var courseId = undefined;
    var tabPane = undefined;
    var shown = false;
    var page = 0;

    // jquery object
    var $deleteLessonModal = $('#delete-lesson-modal');
    var $lessonModuleModal = $('#lesson-module-modal');
    var $deleteLessonButton = $('#delete-lesson-button');

    var $deleteLessonModuleModal = $('#delete-lesson-module-modal');
    var $lessonModuleSaveButton = $('#lesson-module-save-button');
    var $deleteLessonModuleButton = $('#delete-lesson-module-button');

    init();

    $deleteLessonButton.on('click', function (event) {
        deleteLesson($(this).val());
    });

    $deleteLessonModuleButton.on('click', function (event) {
        deleteLessonModule($(this).val());
    });

    $lessonModuleSaveButton.on('click', function (event) {
        var $modal = $lessonModuleModal;
        var lessonId = $modal.find("#lesson-id").val();
        var moduleId = $modal.find("#module-id").val();
        var lessonModule = {
            lessonId: lessonId,
            moduleId: moduleId
        };
        saveLessonModule(lessonModule);
    });

    function init() {
        getCourses();
    }

    function getCourses() {
        var settings = {
            url: '/api/v1/courses',
            method: 'GET',
            dataType: 'json',
            success: function (res) {
                if (!shown) {
                    appendNavTabs(courseTab, res.content, function () {
                        $('a[data-toggle="tab"]').on('shown.bs.tab', function (event) {
                            courseId = event.target.dataset.id;
                            tabPane = document.getElementById(courseId);
                            if (!tabPane.firstChild) {
                                var alertContainer = document.createElement('div');
                                alertContainer.classList.add('alert-container');
                                tabPane.appendChild(alertContainer);
                            }
                            getLessonByCourseId();
                            shown = true;
                        });
                        $('#nav-tab a:first-child').tab('show');
                    });
                    courseTab.style.display = 'block';
                } else {
                    getLessonByCourseId();
                }
            },
            error: function (res) {
                console.error(res);
            },
            beforeSend: function () {
                $(".preloader-backdrop").show();
            },
            complete: function () {
                $(".preloader-backdrop").hide();
            }
        };
        $.ajax(settings);

        function getLessonByCourseId() {
            var settings = {
                method: 'GET',
                url: '/api/v1/lessons',
                data: {
                    courseId: courseId,
                    page: page,
                    size: 30,
                    sort: 'orderNumber,ASC'
                },
                dataType: 'json',
                success: function (res) {
                    renderTabContent(res);
                },
                error: function (res) {
                    console.log(res);
                },
                beforeSend: function () {
                    $(".preloader-backdrop").show();
                },
                complete: function () {
                    $(".preloader-backdrop").hide();
                }
            };
            $.ajax(settings);
        }
    }

    function saveLessonModule(lessonModule) {
        var settings = {
            method: 'POST',
            url: '/api/v1/lesson-modules',
            data: JSON.stringify(lessonModule),
            contentType: 'application/json',
            dataType: 'json',
            success: function (res) {
                $lessonModuleModal.modal('hide');
                getCourses();
                showAlert(tabPane.firstChild, 'success', 'Thêm học vào bài học thành công.');
            },
            error: function (res) {
                console.log(res);
            },
            beforeSend: function () {
                $(".preloader-backdrop").show();
            },
            complete: function () {
                $(".preloader-backdrop").hide();
            }
        };
        $.ajax(settings);
    }

    function renderTabContent(lessonPage) {
        var content = lessonPage.content;
        var pageable = lessonPage.pageable;
        if (table) {
            table.remove();
        }
        var thead = createTableHeader(function (thead) {
            var columns = [
                createHeaderColumn(function (th) {
                    th.textContent = '#';
                    th.style.width = '50px';
                }),
                createHeaderColumn(function (th) {
                    th.textContent = 'Bài học';
                }),
                createHeaderColumn(function (th) {
                    th.textContent = 'Gồm các học phần';
                }),
                createHeaderColumn(function (th) {
                    th.textContent = 'Hành động';
                    th.style.width = '100px';
                })
            ];
            createRow(thead, columns);
        });
        var tbody = createTableBody(function (tbody) {
            var columns = [];
            if (content && content.length) {
                for (var i = 0; i < content.length; i++) {
                    var orderNumber = pageable.offset + i + 1;
                    var lessonId = content[i].id;
                    var lessonName = 'Bài ' + content[i].orderNumber;
                    var moduleIds = [];
                    columns = [
                        createColumn(function (td) {
                            td.textContent = orderNumber;
                        }),
                        createColumn(function (td) {
                            td.textContent = lessonName;
                        }),
                        createColumn(function (td) {
                            var lessonModules = content[i].lessonModules;
                            if (lessonModules && lessonModules.length) {
                                for (var j = 0; j < lessonModules.length; j++) {
                                    moduleIds.push(lessonModules[j].moduleId);
                                    var div = document.createElement('div');
                                    var code = document.createElement('code');
                                    var a = document.createElement('a');
                                    a.href = "/admin/management/lesson-module/" + lessonModules[j].id;
                                    a.textContent = lessonModules[j].moduleName;
                                    code.appendChild(a);
                                    code.appendChild(createSpan(function (span) {
                                        span.classList.add('ml-2', 'text-danger', 'delete-module');
                                        span.appendChild(createIcon(['fa', 'fa-remove']));
                                        span.dataset.id = lessonModules[j].id;
                                        span.dataset.name = lessonModules[j].moduleName;
                                        span.dataset.toggle = 'tooltip';
                                        span.setAttribute('title', 'Xoá học phần');
                                        span.addEventListener('click', function (event) {
                                            $deleteLessonModuleModal.find('.modal-title').text('Thông báo hệ thống');
                                            $deleteLessonModuleModal.find('.modal-body').html('Bạn có muốn xoá học phần [<strong>' + this.dataset.name + '</strong>] này khỏi bài học không?');
                                            $deleteLessonModuleButton.val(this.dataset.id);
                                            $deleteLessonModuleModal.modal('show');
                                        });
                                    }));
                                    div.appendChild(code);
                                    td.appendChild(div);
                                }
                            }
                        }),
                        createColumn(function (td) {
                            var createLessonModuleButton = createButton(function (button) {
                                button.dataset.lessonId = lessonId;
                                button.dataset.lessonName = lessonName;
                                button.dataset.moduleIds = JSON.stringify(moduleIds);
                                button.classList.add('btn', 'btn-sm', 'btn-primary', 'create-button', 'mr-1');
                                button.appendChild(createIcon(['fa', 'fa-plus']));
                                button.dataset.toggle = 'tooltip';
                                button.setAttribute('title', 'Thêm học phần cho bài học');
                                button.addEventListener('click', onClickCreateLessonModuleButton);
                            });
                            td.appendChild(createLessonModuleButton);
                            var updateButton = createButton(function (button) {
                                button.dataset.id = lessonId;
                                button.classList.add('btn', 'btn-sm', 'btn-warning', 'update-button', 'mr-1');
                                button.appendChild(createIcon(['fa', 'fa-pencil']));
                                button.dataset.toggle = 'tooltip';
                                button.setAttribute('title', 'Sửa bài học');
                                button.addEventListener('click', function () {
                                    // var element = $(this);
                                    // var $modal = $('#module-modal').modal('show');
                                    // $modal.find('.modal-title').text('Sửa học phần');
                                    // $modal.find('#id').val(element.data('id'));
                                    // $modal.find('#name').val(element.data('name'));
                                    // $modal.find('#description').val(element.data('description'));
                                });
                            });
                            td.appendChild(updateButton);
                            var deleteButton = createButton(function (button) {
                                button.dataset.id = lessonId;
                                button.dataset.name = lessonName;
                                button.classList.add('btn', 'btn-sm', 'btn-danger', 'delete-lesson-button');
                                button.appendChild(createIcon(['fa', 'fa-close']));
                                button.dataset.toggle = 'tooltip';
                                button.setAttribute('title', 'Xóa bài học');
                                button.addEventListener('click', onClickDeleteButton);
                            });
                            td.appendChild(deleteButton);
                        })
                    ];
                    createRow(tbody, columns);
                }
            } else {
                columns = [
                    createColumn(function (td) {
                        td.setAttribute('colspan', 4);
                        td.textContent = 'Không có bản ghi';
                    })
                ];
                createRow(tbody, columns);
            }
        });

        table = createTable(function (table) {
            table.classList.add('table', 'table-sm', 'table-bordered');
            table.appendChild(thead);
            table.appendChild(tbody);
        });

        tabPane.appendChild(table);

        $('[data-toggle="tooltip"]').tooltip();

        function onClickLessonModuleContent() {
            var element = $(this);
            var lessonName = element.data('lessonName');
            var moduleName = element.data('moduleName');
        }

        function onClickCreateLessonModuleButton() {
            var element = $(this);
            $lessonModuleModal.find('.modal-title').text('Thêm học phần cho bài học');
            $lessonModuleModal.find('input#lesson-id').val(element.data('lessonId'));
            $lessonModuleModal.find('input#lesson-name').val(element.data('lessonName'));
            getModules($lessonModuleModal, element);
            $lessonModuleModal.modal('show');
        }

        function onClickDeleteButton(event) {
            var element = $(this);
            $deleteLessonModal.find('.modal-title').text('Thông báo hệ thống');
            $deleteLessonModal.find('.modal-body').html('Bạn có muốn xóa ' + '<strong>[' + element.data('name') + ']</strong> không?');
            $deleteLessonButton.val($(this).data('id'));
            $deleteLessonModal.modal('show');
        }

    }

    function setPage(page){
        if(this.page !== page){
            this.page = page;
            getCourses();
        }
    }

    function getModules($modal, element) {
        var moduleIds = element.data('moduleIds');
        $.ajax({
            method: 'GET',
            url: '/api/v1/modules',
            dataType: 'json',
            success: function (res) {
                var modules = res.content;
                if (modules && modules.length) {
                    var moduleSelect = $modal.find('select#module-id').empty();
                    for (var j = 0; j < modules.length; j++) {
                        var append = true;
                        for (var k = 0; k < moduleIds.length; k++) {
                            if (moduleIds[k] === modules[j].id) {
                                append = false;
                                break;
                            }
                        }
                        if (append) {
                            moduleSelect.append('<option value="' + modules[j].id + '">' + modules[j].name + '</option>');
                        }
                    }
                }
            },
            error: function () {

            }
        });
    }

    function deleteLesson(id) {
        $.ajax({
            url: '/api/v1/lessons/' + id,
            method: 'DELETE',
            success: function () {
                $deleteLessonModal.modal('hide');
                getCourses();
                showAlert(tabPane.firstChild, 'success', 'Xóa bài học thành công.');
            },
            error: function () {
                $deleteLessonModal.modal('hide');
                showAlert(tabPane.firstChild, 'danger', 'Xóa bài học thất bại.');
            }
        });
    }

    function deleteLessonModule(id) {
        $.ajax({
            url: '/api/v1/lesson-modules/' + id,
            method: 'DELETE',
            success: function () {
                $deleteLessonModuleModal.modal('hide');
                getCourses();
                showAlert(tabPane.firstChild, 'success', 'Xóa học phần thành công.');
            },
            error: function () {
                $deleteLessonModuleModal.modal('hide');
                showAlert(tabPane.firstChild, 'danger', 'Xóa học phần thất bại.');
            }
        });
    }

});