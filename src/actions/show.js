/**
 * # Show Action
 * Show a slot or group of slots.
 */

var SlotFactory = require('../modules/slot-factory.js'),
    GroupFactory = require('../modules/group-factory.js'),
    masterGroup = require('../modules/master-group.js'),
    log = require('../modules/log.js'),
    enableServices = require('../util/enable-services.js'),
    disable = require('./disable.js'),
    googletag = require('../modules/googletag.js');

/**
 * @param {!Slot[]} slots
 */
function callAdsFor(slots) {
    var refreshQueue = [],
        displayQueue = [];

    // Activate slots and queue for display or refresh.
    slots.forEach(function (slot) {
        if (slot.enabled) {
            if (slot.active) {
                refreshQueue.push(slot.gpt);
            } else {
                slot.activate();
                displayQueue.push(slot);

                if (disable.initialLoadRestored) {
                    refreshQueue.push(slot.gpt);
                }
            }
        }
    });

    // Enable the GPT services.
    enableServices();

    // Display or refresh the slots.
    displayQueue.forEach(function (slot) {
        googletag.display(slot.id);
    });
    if (refreshQueue.length) {
        googletag.pubads().refresh(refreshQueue);
    }
}

/**
 * ## harmony.show
 * Activate Slots and make their ad calls. If a slot has already been
 * activated, then calls to `show` will refresh its contents.
 */
module.exports = {
    /**
     * ### all()
     * *Danger Zone* Show all slots in the page.
     */
    all: function () {
        callAdsFor(masterGroup);
    },
    /**
     * ### group(name)
     * Show all ads in a group.
     * @param {string} name
     */
    group: function (name) {
        var group = GroupFactory.create(name);
        callAdsFor(group);
    },
    /**
     * ### slot(name)
     * Show a single ad slot.
     * @param {string} name
     */
    slot: function (name) {
        var slot = SlotFactory.get(name);
        callAdsFor([slot]);
    }
};
