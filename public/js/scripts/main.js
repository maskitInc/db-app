/**
 * Created by MSKT on 27.01.2017.
 */
var LawDecision = {
    viewportList: {
        mainPageView: $('#main-page-view')
    },
    functionalElements: {
        mainMenuBtn: $('.main_menu_btn')
    },
    checkTouchScreen: function () {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            $('body').addClass('touch-screen');
            return true;
        } else {
            $('body').removeClass('touch-screen');
            return false;
        }
    },
    orientationChange: function () {
        window.addEventListener("orientationchange", function (e) {
            //alert(window.orientation);
            if (window.orientation === -90 || window.orientation === 90) {
                
            } else {
                
            }
        }, true);
        
        var mql = window.matchMedia("(orientation: portrait)");
    },
    hideTopNavOnScroll: function () {
        //var mywindow = $(document);
        var mywindow = $('.main-content-inner');
        var mypos = mywindow.scrollTop(),
            up = false,
            newscroll;
        
        var topNav = $('.top-nav'),
            contNav = $('.tn-content'),
            topNavHeight = topNav.height(),
            contNavHeight = contNav.height(),
            newContNavHeight;
        
        mywindow.on("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove", function () {
            if (!$('body').hasClass('dont-have-scroll')) {
                newscroll = mywindow.scrollTop();
                newTopNavHeight = topNav.height();
                if (newscroll > mypos && !up) {
                    
                    topNav.stop().animate({
                        top: -newTopNavHeight
                    }, 300, 'easeOutCubic').addClass('top-nav-sml');
                    
                    up = !up;
                    console.log('DOWN ' + newscroll + '||' + up);
                } else if (newscroll < mypos && up) {
                    
                    topNav.stop().animate({
                        top: 0
                    }, 350, 'easeOutCubic');
                    
                    up = !up;
                    console.log('UP ' + newscroll + '||' + up);
                } else if (newscroll === 0) {
                    
                    topNav.removeClass('top-nav-sml');
                    
                }
                mypos = newscroll;
            }
        });
    },
    checkDesktopSize: function () {
        
        var bodyWidth = document.documentElement.clientWidth,
            bodyHeight = document.documentElement.clientHeight;
        
        var topNav = $('.top-nav'),
            contNav = $('.tn-content'),
            topNavHeight = topNav.height(),
            contNavHeight = contNav.height();
        
        var mainContentInner = $('.main-content-inner'),
            mciHeight = mainContentInner.height();
        
    },
    mainMenuFuncs: function () {
        
        var mobileMenuTransitionEvent = whichTransitionEvent();
        
        var htmlBody = $('html , body'),
            appView = $('.app-view'),
            appViewContent = $('.app-view-content'),
            mobileNavigation = $('.mobile-navigation');
        
        var openMobileMenu = $('.open-mobile-menu'),
            closeMobileMenu = $('.close-mobile-menu');
        
        openMobileMenu.on('click', function (e) {
            htmlBody.addClass('mobile-menu-active');
            $(this).addClass('tn-mobile-btn-active');
            
            $.when(mobileNavigation.one(mobileMenuTransitionEvent, function (event) {
                mobileNavigation.css({
                    'overflow-y': 'auto'
                });
            })).done(function (event) {
                mobileNavigation.css({
                    'height': '100%',
                    'width': '100%'
                });
            });
            
            e.preventDefault();
            e.stopPropagation();
        });
        
        closeMobileMenu.on('click', function (e) {
            
            appView.addClass('close-mobile-menu-transition');
            mobileNavigation.addClass('close-mobile-menu-transition');
            
            $.when(appView.one(mobileMenuTransitionEvent, function (event) {
                
                $('.tn-mobile-btn').removeClass('tn-mobile-btn-active');
                htmlBody.removeClass('mobile-menu-active');
                mobileNavigation.removeAttr("style");
                mobileNavigation.removeClass('close-mobile-menu-transition');
                appView.removeClass('close-mobile-menu-transition');
            })).done(function (event) {
            });
            
            e.preventDefault();
            e.stopPropagation();
        });
        
    },
    findWordAndHighlight: function () {
        $(".item.guarantie p:contains('Law Decision')").html(function (_, html) {
            return html.replace(/(Law Decision)/g, '<span class="highlight" title="Начните прямо сейчас">$1</span>')
        });
    },
    btnsFuncs: function () {
        
        var dialogAnimationEvent = whichAnimationEvent();
        var dialogTransitionEvent = whichTransitionEvent();
        
        var htmlBody = $('html , body'),
            modalWindow = $('.dialog'),
            modalWindowForm = modalWindow.find('form'),
            modalWindowFormGroups = modalWindowForm.find('.form-group'),
            modalFormInputs = modalWindowForm.find('input'),
            modalFormTextAreas = modalWindowForm.find('textarea'),
            modalFormAllInputs = modalWindowForm.find('input , textarea');
        
        var randNum = randomString(10);
        
        var btnFuncs = {
            openForm: function () {
                htmlBody.addClass('modal-active');
                modalWindow.addClass('dialog--open');
                modalWindowForm.attr('id', randNum);
            },
            closeForm: function () {
                modalWindow.addClass('dialog--close');
                
                $.when(modalWindow.one(dialogAnimationEvent, function (event) {
                    htmlBody.removeClass('modal-active');
                    modalWindow.removeClass('dialog--close dialog--open');
    
                    modalWindowFormGroups.attr('class', 'form-group');
                    modalFormAllInputs.val("");
                    
                })).done(function (event) {
                    //modalWindow.removeClass('dialog--open');
                });
            },
            sendForm: function () {
                
                modalWindow.addClass('dialog--submitted');
                
                modalWindowForm.attr('id', randNum).removeClass('all-filled-out');
                modalWindowFormGroups.attr('class', 'form-group');
                modalFormAllInputs.val("");
    
                $(document).find('button[data-form-btn="sendForm"]').attr('data-form-btn', 'checkValidity').removeClass('btn-primary').addClass('btn-disable');
                setTimeout(function () {
                    modalWindow.removeClass('dialog--submitted');
                }, 5000);
                
            },
            checkValidity: function () {
                for (i = 0; i < modalFormInputs.length; ++i) {
                    
                    var input = modalFormInputs.eq([i]),
                        inputContains = input.val(),
                        inputParent = input.closest('.form-group');
                    
                    if (inputContains != '') {
                        if (input.attr('type') === 'email') {
                            inputParent.find('.attention-text span').text('Введите Ваш e-mail, чтобы мы могли с вами связаться!');
                            if (!validateEmail(inputContains)) {
                                inputParent.addClass('not-valid').find('.attention-text span').text('Эй, внимательней будь!');
                            } else {
                                inputParent.removeClass('not-valid');
                            }
                        } else {
                            inputParent.removeClass('not-valid');
                        }
                    } else {
                        inputParent.addClass('not-valid');
                    }
                }
                
                for (i = 0; i < modalFormTextAreas.length; ++i) {
                    
                    var textarea = modalFormTextAreas.eq([i]),
                        textareaContains = textarea.val(),
                        textareaParent = textarea.closest('.form-group');
                    
                    if (textareaContains.trim() != '') {
                        textareaParent.removeClass('not-valid');
                    } else {
                        textareaParent.addClass('not-valid');
                    }
                    
                }
            }
        };
        
        $(document).on('click', '.form-btn', function (e) {
            var data = $(this).attr('data-form-btn');
            
            btnFuncs[data]();
            
            e.preventDefault();
            e.stopPropagation();
        });
        
        /*
         $(document).on('click', '.form-btn', function (e) {
         
         var formBtnAction = $(this).attr('data-action');
         
         console.log(formBtnAction);
         
         if (formBtnAction === 'open-form') {
         htmlBody.addClass('modal-active');
         modalWindow.addClass('dialog--open');
         }
         
         if (formBtnAction === 'close-form') {
         modalWindow.addClass('dialog--close');
         
         $.when(modalWindow.one(dialogAnimationEvent, function (event) {
         htmlBody.removeClass('modal-active');
         modalWindow.removeClass('dialog--close dialog--open');
         })).done(function (event) {
         //modalWindow.removeClass('dialog--open');
         });
         }
         
         if (formBtnAction === 'check-validity') {
         for (i = 0; i < modalFormInputs.length; ++i) {
         
         var input = modalFormInputs.eq([i]),
         inputContains = input.val(),
         inputParent = input.closest('.form-group');
         
         if (inputContains != '') {
         if (input.attr('type') === 'email') {
         inputParent.find('.attention-text span').text('Введите Ваш e-mail, чтобы мы могли с вами связаться!');
         if (!validateEmail(inputContains)) {
         inputParent.addClass('not-valid').find('.attention-text span').text('Эй, внимательней будь!');
         } else {
         inputParent.removeClass('not-valid');
         }
         } else {
         inputParent.removeClass('not-valid');
         }
         } else {
         inputParent.addClass('not-valid');
         }
         }
         
         for (i = 0; i < modalFormTextAreas.length; ++i) {
         
         var textarea = modalFormTextAreas.eq([i]),
         textareaContains = textarea.val(),
         textareaParent = textarea.closest('.form-group');
         
         if (textareaContains.trim() != '') {
         textareaParent.removeClass('not-valid');
         } else {
         textareaParent.addClass('not-valid');
         }
         
         }
         }
         
         if (formBtnAction === 'send-form') {
         
         modalWindow.addClass('dialog--close');
         
         $.when(modalWindow.one(dialogAnimationEvent, function (event) {
         htmlBody.removeClass('modal-active');
         modalWindow.removeClass('dialog--close dialog--open');
         })).done(function (event) {
         //modalWindow.removeClass('dialog--open');
         });
         }
         
         e.preventDefault();
         e.stopPropagation();
         });
         */
        
        // checkValidity.on('click', function (e) {
        //
        //     for (i = 0; i < modalFormInputs.length; ++i) {
        //
        //         var input = modalFormInputs.eq([i]),
        //             inputContains = input.val(),
        //             inputParent = input.closest('.form-group');
        //
        //         if (inputContains != '') {
        //             if (input.attr('type') === 'email') {
        //                 inputParent.find('.attention-text span').text('Введите Ваш e-mail, чтобы мы могли с вами связаться!');
        //                 if (!validateEmail(inputContains)) {
        //                     inputParent.addClass('not-valid').find('.attention-text span').text('Эй, внимательней будь!');
        //                 } else {
        //                     inputParent.removeClass('not-valid');
        //                 }
        //             } else {
        //                 inputParent.removeClass('not-valid');
        //             }
        //         } else {
        //             inputParent.addClass('not-valid');
        //         }
        //     }
        //
        //     for (i = 0; i < modalFormTextAreas.length; ++i) {
        //
        //         var textarea = modalFormTextAreas.eq([i]),
        //             textareaContains = textarea.val(),
        //             textareaParent = textarea.closest('.form-group');
        //
        //         if (textareaContains.trim() != '') {
        //             textareaParent.removeClass('not-valid');
        //         } else {
        //             textareaParent.addClass('not-valid');
        //         }
        //
        //     }
        //
        //     e.preventDefault();
        //     e.stopPropagation();
        // });
        
        // openModal.on('click', function (e) {
        //     htmlBody.addClass('modal-active');
        //     modalWindow.addClass('dialog--open');
        //
        //     e.preventDefault();
        //     e.stopPropagation();
        // });
        
        // closeModal.on('click', function (e) {
        //
        //     modalWindow.addClass('dialog--close');
        //
        //     $.when(modalWindow.one(dialogAnimationEvent, function (event) {
        //         htmlBody.removeClass('modal-active');
        //         modalWindow.removeClass('dialog--close');
        //     })).done(function (event) {
        //         modalWindow.removeClass('dialog--open');
        //     });
        //
        //     e.preventDefault();
        //     e.stopPropagation();
        // });
        
    },
    inputFuncs: function () {
        
        var dialogForm = $('.dialog form'),
            dialogFormInput = dialogForm.find('input'),
            dialogFormTextarea = dialogForm.find('textarea'),
            dialogFormInputs = dialogForm.find('input , textarea');
        
        dialogFormInputs.on("blur", function (e) {
            
            var item = $(this);
            
            checkForms(item);
            checkFullOrNot();
            
        });
        
        dialogFormInputs.on('focus', function () {
            $(this).closest('.form-group').addClass('focus');
        });
        
        function checkForms(item) {
            if (item.val() != '') {
                item.closest('.form-group').removeClass('empty');
                item.closest('.form-group').addClass('full');
            } else {
                item.closest('.form-group').removeClass('focus').addClass('empty');
                item.closest('.form-group').removeClass('full');
            }
        }
        
        function checkMailIsCorrect() {
            
            var str;
            
            var eMail = $(document).find('input[type="email"]'),
                eMailVal = eMail.val();
            
            if (eMailVal != '') {
                if (!validateEmail(eMailVal)) {
                    eMail.closest('.form-group').addClass('not-valid').find('.attention-text span').text('Эй, внимательней будь!');
                    return str = 'email is incorrect';
                } else {
                    eMail.closest('.form-group').removeClass('not-valid');
                    return str = 'email is correct';
                }
            } else {
                return str = 'email input is empty';
            }
            
        };
        
        function checkFullOrNot() {
            
            
            var mailIs = checkMailIsCorrect();
            console.log(mailIs);
            
            if (dialogFormInput.val().length !== 0 && dialogFormTextarea.val().length !== 0 && mailIs === 'email is correct') {
                dialogForm.addClass('all-filled-out');
                $(document).find('button[data-form-btn="checkValidity"]').attr('data-form-btn', 'sendForm').removeClass('btn-disable').addClass('btn-primary');
            } else {
                dialogForm.removeClass('all-filled-out');
                $(document).find('button[data-form-btn="sendForm"]').attr('data-form-btn', 'checkValidity').removeClass('btn-primary').addClass('btn-disable');
            }
            
        };
        
        
    },
    init: function () {
        this.checkDesktopSize();
        this.checkTouchScreen();
        this.orientationChange();
        this.hideTopNavOnScroll();
        this.mainMenuFuncs();
        this.findWordAndHighlight();
        this.btnsFuncs();
        this.inputFuncs();
    }
};

var appView = $('.app-view');

appView.hide();

document.onreadystatechange = function () {
    if (document.readyState == "interactive") {
        setTimeout(function () {
            LawDecision.init();
            $('.white_over_all').css({
                'display': 'none'
            });
        }, 250);
        appView.show();
    }
}


$(window).on('resize', function () {
    LawDecision.checkDesktopSize();
    LawDecision.hideTopNavOnScroll();
});


$(document).mouseup(function (e) {
    $(document).unbind('mousemove');
});