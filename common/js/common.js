document.addEventListener('DOMContentLoaded', () => {

  // 추천상품 슬라이드 01
  const recommendSwiper = new Swiper('#pl-recommend-wrap .swiper', {
    freeMode: true,
    loop: false,
    slidesPerView: 2.8,
    spaceBetween: 16,
    slidesOffsetBefore: 20,
    slidesOffsetAfter: 20,
    autoplay: { 
      delay: 2500,
      enabled: false,
    },
    breakpoints: {
      769: {
        freeMode: false,
        loop: true,
        slidesPerView: 4,
        spaceBetween: 24,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false,
          enabled: true
        },
        navigation: {
          nextEl: '#pl-recommend-wrap .swiper-button-next',
          prevEl: '#pl-recommend-wrap .swiper-button-prev',
        },
      },
    },
    // init 시와 breakpoints 변경 시 start/stop 호출
    on: {
      init(swiper) {
        // init 시, 첫 슬라이드로 이동
        swiper.slideTo(0, 0);

        // autoplay 시작
        if (swiper.params.autoplay.enabled) swiper.autoplay.start();
      },
      breakpoint(swiper) {
        // 브레이크포인트 전환 시에도 동일하게 처리
        swiper.slideTo(0, 0);

        if (swiper.params.autoplay.enabled) {
          swiper.autoplay.start();
        } else {
          swiper.autoplay.stop();
        }
      },
    },
  });

  // 추천상품 슬라이드 02
  const recommendGroupSwiper = new Swiper('#pl-group-recommend-wrap .swiper', {
    freeMode: true,
    loop: false,
    slidesPerView: 2.8,
    spaceBetween: 16,
    slidesOffsetBefore: 20,
    slidesOffsetAfter: 20,
    autoplay: { 
      delay: 2500,
      enabled: false,
    },
    breakpoints: {
      769: {
        freeMode: false,
        loop: true,
        slidesPerView: 4,
        spaceBetween: 24,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false,
          enabled: true
        },
        navigation: {
          nextEl: '#pl-group-recommend-wrap .swiper-button-next',
          prevEl: '#pl-group-recommend-wrap .swiper-button-prev',
        },
      },
    },
    // init 시와 breakpoints 변경 시 start/stop 호출
    on: {
      init(swiper) {
        // init 시, 첫 슬라이드로 이동
        swiper.slideTo(0, 0);

        // autoplay 시작
        if (swiper.params.autoplay.enabled) swiper.autoplay.start();
      },
      breakpoint(swiper) {
        // 브레이크포인트 전환 시에도 동일하게 처리
        swiper.slideTo(0, 0);

        if (swiper.params.autoplay.enabled) {
          swiper.autoplay.start();
        } else {
          swiper.autoplay.stop();
        }
      },
    },
  });

  
  // 추천 상품의 장바구니 & 나이 제한 상품 클릭 시, Alert 이벤트
  function alertHandler(msg) {
    return function(e) {
      e.preventDefault();
      e.stopPropagation();
      alert(msg);
    };
  }

  // 셀렉터 + 메시지 매핑 리스트
  const clickConfigs = [
    {
      selector: '.pl-thumb-cart',
      message: '해당 영역의 장바구니 기능은 준비 중입니다.'
    },
    {
      selector: '.age-restricted',
      message: '나이 제한 체크 기능은 준비 중입니다.'
    }
  ];

  // 각 셀렉터에 대해 이벤트 등록
  clickConfigs.forEach(({ selector, message }) => {
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener('click', alertHandler(message));
    });
  });


  // 탭 영역 활성화 및 스크롤 이동 관련
  const tabButtons = document.querySelectorAll('.event-tab-wrap button');
  
  // aria-controls ↔ 섹션 매핑
  const sections = Array.from(tabButtons)
    .map(btn => {
      const id = btn.getAttribute('aria-controls');
      return document.querySelector(`[aria-labelledby="${id}"]`);
    })
    .filter(sec => sec);

  let isProgrammaticScroll = false;
  let programmaticTargetId = null;
  let scrollEndTimer = null;

  function activateTab(controlId) {
    tabButtons.forEach(btn => {
      btn.parentElement.classList.toggle(
        'active',
        btn.getAttribute('aria-controls') === controlId
      );
    });
  }

  // 프로그래밍 스크롤이 끝났는지 감지
  window.addEventListener('scroll', () => {
    if (!isProgrammaticScroll) return;
    clearTimeout(scrollEndTimer);
    // 마지막 스크롤 이벤트 후 150ms 동안 추가 스크롤이 없으면 “끝”으로 본다
    scrollEndTimer = setTimeout(() => {
      isProgrammaticScroll = false;
      // 최종 목적 탭 확실히 활성화
      if (programmaticTargetId) {
        activateTab(programmaticTargetId);
        programmaticTargetId = null;
      }
    }, 150);
  });

  // 탭 클릭 → 스크롤 및 수동 활성화
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const controlId = btn.getAttribute('aria-controls');
      const target = document.querySelector(`[aria-labelledby="${controlId}"]`);
      if (!target) return;

      // 화면 너비에 따라 여유 공간(px) 다르게 설정
      const screenWidth = window.innerWidth;
      let extraOffset = 0;
      // 모든 탭(event-tab-1,2,3)에 대해
      if (['event-tab-1','event-tab-2','event-tab-3'].includes(controlId)) {
        // PC/Mobile 분기
        extraOffset = screenWidth <= 768 ? 116 : 176;
      }

      const targetY = target.getBoundingClientRect().top + window.pageYOffset - extraOffset;

      isProgrammaticScroll = true;
      programmaticTargetId = controlId;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
      activateTab(controlId);
    });
  });

  // 스크롤 감지에 의한 자동 탭 활성화
  const io = new IntersectionObserver((entries) => {
    if (isProgrammaticScroll) return;  // 프로그래밍 스크롤 중엔 무시
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activateTab(entry.target.getAttribute('aria-labelledby'));
      }
    });
  }, {
    root: null,
    rootMargin: '-50% 0px -50% 0px',
    threshold: 0
  });

  sections.forEach(sec => io.observe(sec));

  
  // 행사 더 보기 모달 이벤트
  const moreSaleBtn = document.getElementById('more-sale-trigger'); // 오픈 버튼
  const moreSaleModal = document.querySelector('.more-event-wrap'); // 모달
  const moreSaleCloseBtn = document.getElementById('close-more-sale'); // 닫기 버튼
  const moreSaleDim = document.querySelector('.more-event-wrap .dim'); // dim 영역
  const htmlDom = document.querySelector('html'); // html 태그 영역 - fixed 설정을 위해

  // 모달 열기/닫기 토글 함수
  function toggleMoreSaleModal(open) {
    htmlDom.classList.toggle('fixed', open);
    moreSaleModal.classList.toggle('active', open);
  }

  // 오픈 버튼
  moreSaleBtn.addEventListener('click', () => toggleMoreSaleModal(true));

  // 닫기 처리할 엘리먼트를 한 번에 모아서 처리
  const closeEles = [moreSaleCloseBtn, moreSaleDim];
  closeEles.forEach(el =>
    el.addEventListener('click', () => toggleMoreSaleModal(false))
  );

  // 창 크기 변경 시 769px 이상이면 모달 닫기
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 769) {
      htmlDom.classList.remove('fixed');
      moreSaleModal.classList.remove('active');
    }
  });


  // 행사 더 보기 모달 내, input 이벤트
  const moreSaleInput    = document.querySelector('.search-form input[name="keyword"]');
  const inputClearBtn   = document.querySelector('.search-form .clear-btn');

  const toggleClear = () => {
    if (moreSaleInput.value.trim() !== '') {
      inputClearBtn.classList.add('active');
    } else {
      inputClearBtn.classList.remove('active');
    }
  };

  // input 초기 상태 체크
  toggleClear();

  // input 입력 시, keyup으로 입력값 체크
  moreSaleInput.addEventListener('keyup', toggleClear);

  // input clear 버튼 이벤트
  inputClearBtn.addEventListener('click', () => {
    moreSaleInput.value = '';
    moreSaleInput.focus();
    toggleClear();
  });

});

// jQuery Area
$(document).ready(function() {
  let htmlDom = jQuery('html');
  let dropdownTrigger = jQuery('#dropdown-trigger');
  let dropdownParent = jQuery('.breadcrumb ol li.dropdown-list');
  let dropdownList = jQuery('.breadcrumb ol li.dropdown-list .link-list-wrap');
  
  dropdownTrigger.on('click', function() {
    dropdownParent.toggleClass('active');
    htmlDom.toggleClass('fixed');
    dropdownList.slideToggle('300');
  })

})
