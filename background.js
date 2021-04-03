const addCommandListener = () => {
    chrome.commands.onCommand.addListener(function (command) {
        if (command === 'search' || command == 'reset') {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { command }, function (response) {
                });
            });
        }
    })
}

chrome.runtime.onInstalled.addListener(function () {
    const matcher = new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { hostEquals: 'github.com' },
    })

    addCommandListener();

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    matcher
                ],
                actions: [
                    new chrome.declarativeContent.ShowPageAction()
                ]
            }
        ]);
    });
});
