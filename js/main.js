/*
AOS.init({
});
*/
/*
  Expandable Class
*/
(function initMobileMenu() {
  const BUTTON_NAME = '#mobile-btn';
  const OPEN_ICON_NAME = '.icon__open';
  const CLOSE_ICON_NAME = '.icon__close';
  const MENU_NAME = '#mobile-menu'
  const CLASS_NAME_ACTIVE = 'active'
  const CLASS_BTN_VISIBLE = 'visible'
  var button = document.querySelector(BUTTON_NAME);
  if (!button) return;
  var menuEl = document.querySelector(MENU_NAME);
  if (!menuEl) return;
  var open_icon = button.querySelector(OPEN_ICON_NAME);
  var close_icon = button.querySelector(CLOSE_ICON_NAME);
  var visible = false;
  closeMenu();
  button.addEventListener('click', toggleMenu);
  function toggleMenu(e) {
    if (visible) {
      closeMenu();
      visible = false;
    }
    else {
      openMenu();
      visible = true;
    }
  }
  function openMenu() {
    menuEl.classList.add(CLASS_NAME_ACTIVE);
    open_icon.classList.remove(CLASS_BTN_VISIBLE);
    close_icon.classList.add(CLASS_BTN_VISIBLE);
  }
  function closeMenu() {
    menuEl.classList.remove(CLASS_NAME_ACTIVE);
    open_icon.classList.add(CLASS_BTN_VISIBLE);
    close_icon.classList.remove(CLASS_BTN_VISIBLE);
  }
})();
(function initAccordeons() {
  const SELECT_NAME = '.accordeon';
  const SELECT_ITEM_NAME = '.accordeon-item';
  const SELECT_CLICK_ITEM_NAME = '.accordeon-item__heading';
  const CLASS_NAME_ACTIVE = 'active';
  var accordeons = document.querySelectorAll(SELECT_NAME);
  if (accordeons.length == 0) return;
  [].forEach.call(accordeons, initAccordeon);

  function initAccordeon(accordeon) {
    var items = accordeon.querySelectorAll(SELECT_ITEM_NAME)
    if (items.length == 0) return;
    activeItem = -1;
    [].forEach.call(items, (item, i) => {
      var heading = item.querySelector(SELECT_CLICK_ITEM_NAME);
      if (!heading) return;
      heading.addEventListener("click", function(e) {
        toggleItem(item, i);
      });
    });
    function toggleItem(item, i) {
      if (i == activeItem) {
        closeItem(item);
        activeItem = -1;
      }
      else {
        openItem(item);
        if (activeItem != -1) {
          closeItem(items[activeItem]);
        }
        activeItem = i;
      }
    }
    function openItem(item) {
      item.classList.add(CLASS_NAME_ACTIVE);
    }
    function closeItem(item) {
      item.classList.remove(CLASS_NAME_ACTIVE);
    }
  }
})();
/*
  Expandable Class
*/
(function initExpandable() {
  const SELECT_NAME = '.expandable';
  const SELECT_CLICK_ITEM_NAME = '.expandable__heading';
  const CLASS_NAME_ACTIVE = 'active';
  var els = document.querySelectorAll(SELECT_NAME);
  if (els.length == 0) return
  [].forEach.call(els, (el) => {
    var heading = el.querySelector(SELECT_CLICK_ITEM_NAME);
    if (!heading) return;
    var active = false;
    heading.addEventListener("click", function(e) {
      toggleItem(el);
    });
    function toggleItem(item) {
      if (active) {
        closeItem(item);
        active = false;
      }
      else {
        openItem(item);
        active = true;
      }
    }
  });
  function openItem(item) {
    item.classList.add(CLASS_NAME_ACTIVE);
  }
  function closeItem(item) {
    item.classList.remove(CLASS_NAME_ACTIVE);
  }
})();
/*
  Custom Dropdown Class
*/
(function initSelectors() {
  const CLASS_NAME_SELECT = 'dropdown';
  const CLASS_NAME_OPTION = 'dropdown-item';
  const CLASS_NAME_ACTIVE = 'show';
  const CLASS_NAME_SELECTED = 'selected';
  const SELECTOR_BUTTON = '.dropdown-toggle';
  const SELECTOR_INPUT = '.dropdown-input';
  const SELECTOR_ACTIVE = '.dropdown.show';
  const SELECTOR_DATA_TOGGLE = '[data-select="toggle"]';
  const SELECTOR_OPTION_SELECTED = '.selected';

  class CustomDropdown {
    constructor(target) {
      this._elRoot = typeof target === 'string' ? document.querySelector(target) : target;
      this._onClickFn = this._onClick.bind(this);
      this._elToggle = this._elRoot.querySelector(SELECTOR_DATA_TOGGLE);
      this._elInput = this._elRoot.querySelector(SELECTOR_INPUT);
      this._elRoot.addEventListener('click', this._onClickFn);
      this._setPlaceholder()
    }
    _setPlaceholder() {
      var btn = this._elRoot.querySelector(SELECTOR_BUTTON);
      if (btn) {
        this._placeholder_text = btn.textContent;
      }
      else {
        this._placeholder_text = "";
      }
    }
    _onClick(e) {
      const target = e.target;
      if (target.classList.contains(CLASS_NAME_OPTION)) {
        this._changeValue(target);
      }
      else {
        this.toggle();
      }
    }
    _update(option) {
      option = option.closest('.' + CLASS_NAME_OPTION);
      const selected = this._elRoot.querySelector(SELECTOR_OPTION_SELECTED);
      if (selected) {
        selected.classList.remove(CLASS_NAME_SELECTED);
      }
      option.classList.add(CLASS_NAME_SELECTED);
      var value = option.dataset['value'];
      if (this._elInput) this._elInput.value = value;
      this._elToggle.textContent = option.textContent;
      this._elToggle.value = value;
      this._elToggle.dataset.index = option.dataset['index'];
      this._elRoot.dispatchEvent(new CustomEvent(CLASS_NAME_SELECT + '.change'));
      return option.dataset['value'];
    }
    _reset() {
      const selected = this._elRoot.querySelector(SELECTOR_OPTION_SELECTED);
      if (selected) {
        selected.classList.remove(CLASS_NAME_SELECTED);
      }
      this._elToggle.textContent = this._placeholder_text;
      this._elToggle.value = '';
      this._elToggle.dataset.index = -1;
      this._elRoot.dispatchEvent(new CustomEvent(CLASS_NAME_SELECT + '.change'));
      return '';
    }
    _changeValue(option) {
      if (option.classList.contains(CLASS_NAME_SELECTED)) {
        this.hide();
        return;
      }
      this._update(option);
      this.hide();
    }
    show() {
      document.querySelectorAll(SELECTOR_ACTIVE).forEach(select => {
        select.classList.remove(CLASS_NAME_ACTIVE);
      });
      this._elRoot.classList.add(CLASS_NAME_ACTIVE);
    }
    hide() {
      this._elRoot.classList.remove(CLASS_NAME_ACTIVE);
    }
    toggle() {
      if (this._elRoot.classList.contains(CLASS_NAME_ACTIVE)) {
        this.hide();
      } else {
        this.show();
      }
    }
    dispose() {
      this._elRoot.removeEventListener('click', this._onClickFn);
    }
    get value() {
      return this._elToggle.value;
    }
    set value(value) {
      let isExists = false;
      this._elRoot.querySelectorAll('.' + CLASS_NAME_OPTION).forEach((option) => {
        if (option.dataset['value'] === value) {
          isExists = true;
          return this._update(option);
        }
      });
      if (!isExists) {
        return this._reset();
      }
    }
    get selectedIndex() {
      return this._elToggle.dataset['index'];
    }
    set selectedIndex(index) {
      const option = this._elRoot.querySelector('.' + CLASS_NAME_OPTION + '[data-index="' + index + '"]');
      if (option) {
        return this._update(option);
      }
      return this._reset();
    }
  }

  document.querySelectorAll("." + CLASS_NAME_SELECT).forEach(select => {
    new CustomDropdown(select);
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.' + CLASS_NAME_SELECT)) {
      document.querySelectorAll(SELECTOR_ACTIVE).forEach(select => {
        select.classList.remove(CLASS_NAME_ACTIVE);
      });
    }
  })
})();

(function initUnchartableForm() {
  var block = document.querySelector(".uncharted-block");
  if (!block) return;
  var selected = [false, false, false]
  var circles = block.querySelectorAll(".form-progress__circle");
  var lines = block.querySelectorAll(".form-progress__connection");
  var cards;
  initCards();
  window.addEventListener("resize", (e) => {
    initCards();
  });
  function initCards() {
    cards = block.querySelectorAll(".form__subscription_card");
    [].forEach.call(cards, initCard);
  }
  function initCard(card) {
    if (card.classList.contains("checked")) {
      cardSelected();
    }
    card.addEventListener("click", (e) => {
      [].forEach.call(cards, (c) => {
        c.classList.remove("checked");
      });
      card.classList.add("checked");
      cardSelected();
    });
    function cardSelected() {
      if (!selected[0]) {
        circles[0].classList.add("active")
        selected[0] = true;
        if (selected[1]) {
          lines[0].classList.add("active")
        }
      }
    }
  }
  var fields = block.querySelectorAll(".form__input-fields .form__input");
  var fields_map = new Map();
  [].forEach.call(fields, initFields);
  function initFields(field) {
    if (field.value.length > 0) {
      fields_map.set(field, true);
    }
    checkRequiredFields()
    field.addEventListener("keyup", (e) => {
      var el = e.target;
      if (el.value.length > 0) {
        fields_map.set(field, true)
      }
      else {
        fields_map.delete(field)
      }
      checkRequiredFields();
    });
    function checkRequiredFields() {
      if (fields_map.size >= 3) {
        circles[1].classList.add("active");
        if (selected[0]) {
          lines[0].classList.add("active");
        }
        selected[1] = true;
      }
      else {
        circles[1].classList.remove("active");
        lines[0].classList.remove("active");
        selected[1] = false;
      }
    }
  }
})();

(function initTableOfContents() {
  const LINK_ACTIVE = "active";
  var el = document.querySelector("#table-of-contents");
  if (!el) return;
  var all_links = el.querySelectorAll("li > a");
  if (all_links.length == 0) return;

  highlightLink();
  [].forEach.call(all_links, el => el.addEventListener("click", clickLink));

  function clickLink(event) {
    [].forEach.call(all_links, el => el.classList.remove(LINK_ACTIVE));
    event.target.classList.add(LINK_ACTIVE);
  }

  function highlightLink() {
    var link_index = 0;
    var found = false;
    for (let i = 0; i < all_links.length; i++) {
      let link = all_links[i];
      if (!found && String(document.location).endsWith(link.href)) {
        link_index = i;
        found = true;
      }
      link.classList.remove(LINK_ACTIVE)
    }
    all_links[link_index].classList.add(LINK_ACTIVE);
  }
})();

function initSlider(slider_options, media_query = undefined) {
  // check if element with slider_id exists
  var slideEl = document.querySelector(slider_options.container);
  if (!slideEl) return;

  var slide;
  function windowResolutionChange(media_query) {
    if (media_query.matches) {
      createSlider();
    } else {
      destroySlider();
    }
  }

  function getWindowWidth() {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  }

  function createSlider() {
    // if already exists - rebuild it
    if (slide) {
      slide = slide.rebuild();
      addCenterSlide();
      initSlideEvents();
      if (slider_options.slideOnNonCenteredItems) {
        activateSlideOnNonCenteredItems();
      }
      return;
    }
    // create new slider
    slide = tns(slider_options);
    function addCenterSlide() {
      slide
        .getInfo()
        .slideItems[slide.getInfo().index].classList.add(
          "vl-slide-center"
        );
    }
    addCenterSlide();
    initSlideEvents();

    if (slider_options.slideOnNonCenteredItems) {
      activateSlideOnNonCenteredItems();
    }

    function initSlideEvents() {
      slide.events.on("indexChanged", () => {
        const info = slide.getInfo();
        const indexCurr = info.index;
        const elements = slideEl.getElementsByClassName("vl-slide-center");
        while (elements.length > 0) {
          elements[0].classList.remove("vl-slide-center");
        }
        info.slideItems[indexCurr].classList.add("vl-slide-center");
      });
    }

    function activateSlideOnNonCenteredItems() {
      [].forEach.call(slide.getInfo().slideItems, (item, index) => {
        item.addEventListener("click", e => {
          const indexCurr = slide.getInfo().index;
          var skipFromCentered = getCenteredCount();
          if (index < indexCurr) {
            e.preventDefault();
            slide.goTo('prev');
          }
          else if (index > indexCurr + skipFromCentered) {
            e.preventDefault();
            slide.goTo('next');
          }
        });
      });
    }
    function getCenteredCount() {
      var skipFromCentered = 0;
      var csc = slider_options["centerSlidesCount"];
      if (csc && csc > 0) skipFromCentered = csc - 1;
      var ww = getWindowWidth();
      var responsive = slider_options.responsive;
      if (responsive) {
        for (var bp in responsive) {
          bp = parseInt(bp); // convert string to number
          if (ww >= bp) {
            csc = responsive[bp]["centerSlidesCount"];
            if (csc && csc > 0) skipFromCentered = csc - 1;
          }
        }
      }
      return skipFromCentered;
    }
  }
  function destroySlider() {
    if (!slide) return;
    slide.destroy();
  }

  if (!media_query) {
    createSlider();
    return;
  }
  var tablet_media_query = window.matchMedia(media_query)
  tablet_media_query.addListener(windowResolutionChange)
  windowResolutionChange(tablet_media_query);
};

function initSliders(slider_opts) {
  var name = slider_opts.container;
  name = "." + name.substr(1, name.length);
  var els = document.querySelectorAll(name);
  if (els.length == 0) return;
  [].forEach.call(els, makeSlider)

  function makeSlider(el) {
    var opts = makeOptions(el, slider_opts);
    if (!opts) return;
    initSlider(opts);
  }

  function makeOptions(el, slider_opts) {
    var opts = {};
    opts = Object.assign(opts, slider_opts);
    if (!el.id) return null;
    var selector_id = "#" + el.id;
    opts.container = selector_id;
    opts.prevButton = selector_id + "__nav .nav__prev-button"
    opts.nextButton = selector_id + "__nav .nav__next-button"
    return opts;
  }
}

var video_slider_opts = {
  container: "#videos-slider",
  autoWidth: true,
  gutter: 24,
  slideBy: 1,
  nav: false,
  mouseDrag: true,
  slideOnNonCenteredItems: true,
  centerSlidesCount: 1,
  prevButton: "#videos-slider__nav .nav__prev-button",
  nextButton: "#videos-slider__nav .nav__next-button",
  responsive: {
    576: {
      gutter: 32,
    },
    1024: {
      centerSlidesCount: 2,
    },
  },
}

var school_videos_slider_opts = {
  container: "#school-videos-slider",
  autoWidth: true,
  gutter: 32,
  slideBy: 1,
  nav: false,
  mouseDrag: true,
  center: true,
  slideOnNonCenteredItems: true,
  loop: false,
  prevButton: "#school-videos-slider__nav .nav__prev-button",
  nextButton: "#school-videos-slider__nav .nav__next-button",
}

var book_slider_opts = {
  container: "#book-slider",
  autoWidth: true,
  slideBy: 1,
  nav: false,
  slideOnNonCenteredItems: true,
  center: true,
  mouseDrag: true,
  prevButton: "#book-slider__nav .nav__prev-button",
  nextButton: "#book-slider__nav .nav__next-button",
  responsive: {
  },
}

var news_slider_opts = {
  container: "#news-slider",
  items: 1,
  gutter: 8,
  edgePadding: 72,
  slideBy: 1,
  slideOnNonCenteredItems: true,
  centerSlidesCount: 1,
  nav: false,
  mouseDrag: true,
  prevButton: "#news-slider__nav .nav__prev-button",
  nextButton: "#news-slider__nav .nav__next-button",
  responsive: {
    576: {
      items: 2,
      edgePadding: 92,
      gutter: 16,
      centerSlidesCount: 2,
    },
  }
}

var uncharted_form_slider_opts = {
  container: "#form__subscription-type",
  autoWidth: true,
  gutter: 16,
  slideBy: 1,
  nav: false,
  mouseDrag: true,
  loop: false,
  controls: false,
}

var publication_image_slider_opts = {
  container: "#publication-image-slider",
  autoWidth: true,
  gutter: 16,
  slideBy: 1,
  nav: false,
  mouseDrag: true,
  loop: false,
  controls: false,
}

initSlider(news_slider_opts, "(max-width: 1024px)")
initSlider(book_slider_opts)
initSlider(video_slider_opts)
initSliders(school_videos_slider_opts)
initSlider(uncharted_form_slider_opts, "(max-width: 576px)")
initSlider(publication_image_slider_opts)

function smoothScrollTop() {
  var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
  if (currentScroll > 0) {
    window.requestAnimationFrame(smoothScrollTop);
    window.scrollTo(0, currentScroll - (currentScroll / 12));
  }
};

(function initHideOldVersion() {
  var el = document.querySelector(".old-version");
  if (!el) return;
  var btn_el = document.querySelector(".close-old-version-btn");
  btn_el.addEventListener("click", e => {
    el.style.display = "none";
  });
})();
