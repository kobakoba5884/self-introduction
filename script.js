MENU_ITEMS = {
  idk: {
    markdown_file: "bios/en/idk.md",
    key: "idk",
    uri_extension: "",
    title: "",
    image_src: "assets/transparent.png",
    shadow_color: "#a7a7a7",
    gradient_colors: ["#fff", "#aaa", "#555"],
  },
  stalker: {
    markdown_file: "bios/en/internet_stalker.md",
    key: "stalker",
    uri_extension: "stalker",
    title: "so umm wow you are honest",
    image_src: "assets/my-stolker.png",
    shadow_color: "#D2F46B",
    gradient_colors: ["#D2F46B", "#85f46b", "#f4ab6b"],
    starts_with_verb: true,
  },
  romantic_interest: {
    markdown_file: "bios/en/romantic_interest.md",
    key: "romantic_interest",
    uri_extension: "romantic_interest",
    title: "so I am a normal person",
    image_src: "assets/me-bbq.png",
    shadow_color: "#F4AB6B",
    gradient_colors: ["#F4AB6B", "#fffb1e", "#ff0a0a"],
  },
  recruiter: {
    markdown_file: "bios/en/tech_recruiter.md",
    key: "recruiter",
    uri_extension: "recruiter",
    title: "so I am an engineer",
    image_src: "assets/me-working.png",
    shadow_color: "#6B95F4",
    gradient_colors: ["#6B95F4", "#75edcb", "#f5aaed"],
  },
  friend: {
    markdown_file: "bios/en/friend.md",
    key: "friend",
    uri_extension: "friend",
    title: "so you know who I am",
    image_src: "assets/me-friends.png",
    shadow_color: "#6BF4CD",
    gradient_colors: ["#6BF4CD", "#2eff3a", "#deff64"],
  },
  family: {
    markdown_file: "bios/en/family.md",
    key: "family",
    uri_extension: "family",
    title: "so we share the same roots",
    image_src: "assets/family.png",
    shadow_color: "#D7B4E6",
    gradient_colors: ["#D7B4E6", "#8f7cd4", "#6f56c1"],
  },
};
$(function () {
  const updateSite = (item) => {
    $(`[data-bio="${item.key}"]`).prop("selected", true);
    document.getElementById("me-section").innerHTML = item.title;
    $("#me-picture").attr("src", item.image_src);
    $("#me-picture").css("background-color", item.shadow_color);

    $("#categoris").css("box-shadow", ".5rem .5rem " + item.shadow_color);
    if (item.starts_with_verb) {
      $(".label-a").text("an");
    } else {
      $(".label-a").text("a");
    }
    const boxCard = $(".box-card").get(0);
    boxCard.style.setProperty("--color-1", item.gradient_colors[0]);
    boxCard.style.setProperty("--color-2", item.gradient_colors[1]);
    boxCard.style.setProperty("--color-3", item.gradient_colors[2]);
    $(`.bio-text`).hide();
    $(`#${item.key}-text`).show();
  };

  // controller
  const windowKey = window.location.search.slice(1);
  if (windowKey !== "" && MENU_ITEMS[windowKey]) {
    updateSite(MENU_ITEMS[windowKey]);
  } else {
    updateSite(MENU_ITEMS["idk"]);
    window.history.pushState({ key: "idk" }, null, null);
  }

  const selectedKey = $("option:selected").data("bio");
  if (selectedKey && MENU_ITEMS[selectedKey]) {
    updateSite(MENU_ITEMS[selectedKey]);
  }

  function loadMarkdownAndImage(item) {
    fetch(item.markdown_file)
      .then(response => response.text())
      .then(text => {
        document.getElementById(`${item.key}-text`).innerHTML = marked.parse(text, {
          mangle: false,
          headerIds: false,
        });
      });
  
    const img = new Image();
    img.src = item.image_src;
  }

  function updateContentBasedOnLanguage(currentLanguage) {
    for (const key in MENU_ITEMS) {
      let item = MENU_ITEMS[key];
      let originalPath = item.markdown_file.match(/bios\/.*\/.*\.md/)[0];
      let newPath = originalPath.replace(/en|ja/, currentLanguage);
      item.markdown_file = newPath;
  
      loadMarkdownAndImage(item);
    }
  }

  // load text into divs to toggle for later and preload images.
  for (const key in MENU_ITEMS) {
    loadMarkdownAndImage(MENU_ITEMS[key]);
  }

  const languageCheck = $("#language-check");
  languageCheck.change(() => {
    if (languageCheck.prop('checked')) {
      updateContentBasedOnLanguage("ja");
      $(".bio-text").css("font-family", "CustomFontJapanese");
    } else {
      updateContentBasedOnLanguage("en");
      $(".bio-text").css("font-family", "Space_Mono");
    }
  });

  $("#categoris").change((el) => {
    var key = $("option:selected").data("bio");
    window.history.pushState(
      { key: key, test: "test" },
      null,
      `?${MENU_ITEMS[key]["uri_extension"]}`
    );
    updateSite(MENU_ITEMS[key]);
  });

  $(".hamburger").click((el) => {
    $(".links").toggle();
  });

  $("#content").click((el) => {
    if (window.innerWidth < 768) {
      $(".links").hide();
    }
  });

  $(window).on("resize", () => {
    if (window.innerWidth > 768) {
      $(".links").show();
    } else {
      $(".links").hide();
    }
  });
  window.onpopstate = function (e) {
    var d = e.state || { data: "no state" };
    if (e.state.key && MENU_ITEMS[e.state.key]) {
      updateSite(MENU_ITEMS[e.state.key]);
    }
  };
});
