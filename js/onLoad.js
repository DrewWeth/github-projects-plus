
/* Main  */

var avatarDiv = null;

const main = () => {

    var projectHeader = document.getElementsByClassName("js-project-header")[0];
    var projectColumns = document.getElementsByClassName("project-columns")[0];

    const observer = new MutationObserver(observerCallback);
    const config = { attributes: false, childList: true, subtree: true };
    observer.observe(projectColumns, config);

    avatarDiv = createAvatarDiv();
    projectHeader.insertBefore(avatarDiv, projectHeader.children[projectHeader.children.length - 1]);
    changeInputPlaceholder();
    addHotkeyListener()
    styleRightDrawer()
}


/* Helper functions below */

const styleRightDrawer = () => {
    const css = `
    #repo-content-pjax-container div.js-project-card-details-pane {
        width: 600px!important;
    }
    `
    var styleSheet = document.createElement("style")
    styleSheet.innerText = css
    document.head.appendChild(styleSheet)
}

const getFilterElement = () => {
    return document.getElementsByName("card_filter_query")[0];
}

const changeInputPlaceholder = () => {
    var filterElement = getFilterElement();
    if (filterElement) {
        filterElement.placeholder = "Filter (show ctrl+up, reset ctrl+down)"
    }
}

const toggleSearch = () => {
    var filterElement = getFilterElement();
    if (filterElement) {
        if (filterElement === document.activeElement) {
            filterElement.blur()
        } else {
            filterElement.focus();
        }
    }
}

const resetFilter = () => {
    var filterButton = document.getElementsByClassName('issues-reset-query')[0];
    if (filterButton) {
        filterButton.click();
    }
}

const getAvatars = () => {
    var names = {}
    var groups = {}
    const arr = [...document.getElementsByClassName("js-card-filter")].forEach(e => {
        const key = e.getAttribute('data-card-filter')
        var group = key.split(":")[0]
        group = group ? group[0] : ""

        if (!names[key]) {
            names[key] = true;
            groups[group] ? groups[group].push(e) : groups[group] = [e]
        }
    });

    return groups
}

const makeContent = (list) => {
    const div = document.createElement("div");
    Object.entries(list).map(([k, values]) => {
        const d = document.createElement("div")
        d.style["margin-bottom"] = "5px";
        values.forEach(e => e.style["padding-right"] = '5px');
        d.innerHTML = values.map(e => e.outerHTML).join("");
        div.appendChild(d);
    })
    return div;
}

const createAvatarDiv = () => {
    var div = document.createElement("div");
    div.id = "avatar-div";
    div.style["overflow-y"] = "auto";
    div.style["max-height"] = "80px";
    div.style["padding-left"] = "40px";
    div.style["padding-right"] = "10px";
    div.appendChild(makeContent(getAvatars()));
    return div;
}

const observerCallback = function (mutationsList, observer) {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            const avatars = getAvatars()
            const content = makeContent(getAvatars());
            avatarDiv.replaceChildren(content)
        }
    }
};

const addHotkeyListener = () => {
    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request.command == "search") {
                toggleSearch()
                sendResponse()
            } else if (request.command == "reset") {
                resetFilter()
                sendResponse()
            }
        }
    );
}


/* Magic */
main()