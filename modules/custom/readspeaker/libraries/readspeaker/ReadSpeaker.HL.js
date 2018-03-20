rspkr.HL = function () {
  var b = "", a = {
    firstRun: 0,
    previousWord: {},
    previousSent: {},
    lastWord: null,
    selectionRange: null,
    selectionHTML: null,
    selectedWordsRange: []
  }, d = {
    oldWordHL: [], oldWordHLClass: [], oldSentHL: [], oldSentHLClass: [], sync: function (c, a) {
      var b = !1, e = document.getElementById("sync" + a);
      0 == (c & 2) && (b = 0 != (c & 1) ? !0 : !1);
      if (e && e.className.replace("word", "") != e.className) {
        if (!b && 0 < this.oldWordHL.length) {
          for (b = 0; b < this.oldWordHLClass.length; b++)this.oldWordHL[b].className = this.oldWordHLClass[b];
          this.oldWordHL = [];
          this.oldWordHLClass = []
        }
        this.oldWordHLClass.push(e.className);
        this.oldWordHL.push(e);
        e.className = "sync_word_highlighted"
      } else if (e && e.className.replace("sent", "") != e.className) {
        if (!b && 0 < this.oldSentHL.length) {
          for (b = 0; b < this.oldSentHL.length; b++)this.oldSentHL[b].className = this.oldSentHLClass[b];
          this.oldSentHL = [];
          this.oldSentHLClass = []
        }
        this.oldSentHLClass.push(e.className);
        this.oldSentHL.push(e);
        e.className = "sync_sent_highlighted"
      }
      e && rspkr.HL.Scroll.execScroll(e)
    }, preProcess: {
      setRestoreContent: function () {
        rspkr.log("[Servermarkup.preProcess.setRestoreContent] Called!");
        var c = rspkr.Common.data.getParam("readid"), c = document.getElementById(c).innerHTML;
        rspkr.Common.data.setRestoreContent(c)
      }
    }, postProcess: {
      fullCleanUp: function () {
        rspkr.log("[Servermarkup.postProcess.fullCleanUp] Called!");
        rspkr.HL.Restore.all()
      }, lightCleanUp: function () {
        rspkr.log("[Servermarkup.postProcess.lightCleanUp] Called!");
        var c = rspkr.HL.serverMarkup.oldWordHL, a = rspkr.HL.serverMarkup.oldWordHLClass, b = rspkr.HL.serverMarkup.oldSentHL, e = rspkr.HL.serverMarkup.oldSentHLClass;
        if (0 < c.length) {
          for (var f =
            0; f < c.length; f++)c[f].className = a[f];
          rspkr.HL.serverMarkup.oldWordHL = [];
          rspkr.HL.serverMarkup.oldWordHLClass = []
        }
        if (0 < b.length) {
          for (f = 0; f < b.length; f++)b[f].className = e[f];
          rspkr.HL.serverMarkup.oldSentHL = [];
          rspkr.HL.serverMarkup.oldSentHLClass = []
        }
        c = document.getElementsByTagName(rspkr.Common.data.browser.syncContainer);
        for (f = c.length - 1; -1 < f; f--)c[f].className = c[f].className.replace("sync_sent_highlighted", "sync_sent"), c[f].className = c[f].className.replace("sync_word_highlighted", "sync_word"), -1 !== c[f].className.toLowerCase().indexOf("sync_user") &&
        (c[f].className = c[f].className.replace("sync_sent", ""), c[f].className = c[f].className.replace("sync_word", ""), c[f].removeAttribute("id"))
      }
    }
  }, e = {
    enums: {
      key: "readspeaker_inline_styles",
      sent: "sync_sent",
      sent_hl: "sync_sent_highlighted",
      word: "sync_word",
      word_hl: "sync_word_highlighted"
    }, word_index: null, sent_index: null, hlChanged: !1, setHL: function () {
      var c = rspkr.pub.Config, a = rspkr.Common.Settings.get("hlword") || c.item("settings.hlword"), c = rspkr.Common.Settings.get("hlsent") || c.item("settings.hlsent");
      this.updateHL("hlword",
        a, null);
      this.updateHL("hlsent", c, null)
    }, updateHL: function (c, h, e) {
      rspkr.log(c + ", " + h + ", " + e, 5);
      "hlspeed" === c && h !== e && (this.hlChanged = !0);
      if (h !== e && ("hl" === c || "hltoggle" === c))this.hlChanged = !0, rspkr.HL.sync.lightCleanUp();
      if (h !== e && ("hl" === c && "none" !== h || "hltoggle" === c && "hlon" === h))this.setTextStyle("word", rspkr.Common.Settings.get("hlword")), this.setTextStyle("sent", rspkr.Common.Settings.get("hlsent")), this.hlChanged = !0, rspkr.HL.Type.CURRENT === rspkr.HL.Type.CLIENT_MARKUP && rspkr.PlayerAPI.releaseAdapter();
      /hlword|hlsent|hlscroll/i.test(c) && h != e && ("hlscroll" == c ? rspkr.HL.Scroll.initScroll() : (this.setTextStyle(c, h), "explorer" == b && (a.selectionRange && ("wordsent" === rspkr.st.get("hl") && "hlsent" == c) && (a.selectionRange.execCommand("backcolor", 0, rspkr.Common.Settings.get("hlsent")), a.selectionRange.execCommand("forecolor", 0, rspkr.cfg.item("settings.hltext"))), a.lastWord && ("sent" == rspkr.st.get("hl") ? a.lastWord.execCommand("backcolor", 0, rspkr.Common.Settings.get("hlsent")) : a.lastWord.execCommand("backcolor", 0,
        rspkr.Common.Settings.get("hlword")), a.lastWord.execCommand("forecolor", 0, rspkr.cfg.item("settings.hltext"))))))
    }, setTextStyle: function (c, a, b) {
      var d = /word/.test(c) ? "word" : "sent", c = "background-color", b = b || e.enums.key;
      /underline/.test(a) ? (c = "text-decoration", a += " !important; color: none !important; background-color: none !important") : /none/.test(a) ? (c = "background", a += " !important; text-decoration: none !important; background-color: none !important") : a += " !important; text-decoration: none !important";
      rspkr.Common.css.replaceRule(b, "." + e.enums[d + "_hl"], c + ": " + a + "")
    }
  };
  return {
    meta: {revision: "1728"}, init: function () {
      var c = rspkr.Common.addEvent;
      c("onAfterModsLoaded", function () {
        c("onAPIInitAdapter", rspkr.HL.Restore.setRestoreContent);
        rspkr.HL.addEvents();
        rspkr.HL.Scroll.initScroll();
        b = document.selection && (9 > rspkr.Common.data.browser.version || 9 > document.documentMode) ? "explorer" : "gecko";
        rspkr.log("[rspkr.hl] Using engine " + b);
        var h = rspkr.HL.engine[b].clientExtension, e;
        for (e in h)a[e] = h[e];
        window.addEventListener &&
        window.addEventListener("message", rspkr.HL.html5.receiveMessage, !1, !0)
      });
      c("onModsLoaded", {func: e.setHL, context: e});
      c("onSettingsChanged", {func: e.updateHL, context: e});
      rspkr.log("[rspkr.HL] Initialized!")
    }, addEvents: function () {
      rspkr.log("[rspkr.HL.addEvents]");
      evt("onUIClosePlayer", rspkr.HL.cleanUpHandler);
      evt("onUIClosePlayer", function () {
        rspkr.hl.State.setState(rspkr.hl.State.READY)
      });
      evt("onUIStop", function () {
        rspkr.hl.State.setState(rspkr.hl.State.STOPPED)
      });
      evt("onUIBeforePlay", function () {
        rspkr.hl.Restore.checkContent()
      });
      rspkr.PlayerAPI && (rspkr.PlayerAPI.adapter && "html5" === rspkr.PlayerAPI.adapter) && (rspkr.evt("onAPIInitAdapter", rspkr.HL.html5.handlers.init), rspkr.evt("onAPIPlay", rspkr.HL.html5.handlers.play), rspkr.evt("onAPIPause", rspkr.HL.html5.handlers.pause), rspkr.evt("onAPIStop", rspkr.HL.html5.handlers.stop), rspkr.evt("onAPIRewind", rspkr.HL.html5.handlers.updateTime), rspkr.evt("onAPISetProgress", rspkr.HL.html5.handlers.updateTime), rspkr.evt("onAPIReleaseAdapter", rspkr.HL.html5.handlers.release));
      rspkr.evt("onAPIStop",
        rspkr.HL.sync.lightCleanUp)
    }, cleanUpHandler: function (c) {
      rspkr.log("[rspkr.HL.cleanUpHandler] String is: " + c);
      "userclick" === c || "nosel" === c ? rspkr.HL.sync.fullCleanUp() : rspkr.HL.sync.lightCleanUp()
    }, clientMarkup: a, serverMarkup: d, markedUpHTML: "", html5: {
      States: {
        BEGIN: 0,
        STOPPED: 1,
        USER_START_NOT_READY: 2,
        USER_START_PLAYING: 3,
        NOT_PLAYING: 4,
        CURRENT: 0,
        setState: function (c) {
          this.CURRENT = c;
          rspkr.log("[rspkr.hl.html5.States.setState] Changing state from " + this.CURRENT + " to " + c, 1)
        }
      },
      Events: {
        canPlay: !1, durationChange: !1,
        syncReady: !1, eventTimer: null, onCanPlay: function () {
          rspkr.log("onCanPlay fired!", 1);
          this.canPlay = !0;
          this.checkCompletion();
          this.eventTimer = setTimeout(function () {
            rspkr.log("[rspkr.hl.html5.Events] Timer triggered. Starting playback.", 1);
            rspkr.hl.html5.Events.resetAll();
            rspkr.hl.html5.refresh()
          }, 2500);
          return !1
        }, checkCompletion: function () {
          this.canPlay && (this.durationChange && this.syncReady) && (clearTimeout(this.eventTimer), this.eventTimer = null, rspkr.hl.html5.Events.resetAll(), rspkr.hl.html5.refresh())
        },
        onDurationChange: function () {
          rspkr.log("onDurationChange fired!", 1);
          this.durationChange = !0;
          this.checkCompletion();
          this.eventTimer = setTimeout(function () {
            rspkr.log("[rspkr.hl.html5.Events] Timer triggered. Starting playback.", 1);
            rspkr.hl.html5.Events.resetAll();
            rspkr.hl.html5.refresh()
          }, 2500)
        }, onSyncReady: function () {
          rspkr.log("onSyncReady fired!", 1);
          this.syncReady = !0;
          this.checkCompletion();
          this.eventTimer = setTimeout(function () {
            rspkr.log("[rspkr.hl.html5.Events] Timer triggered. Starting playback.", 1);
            rspkr.hl.html5.Events.resetAll();
            rspkr.hl.html5.refresh()
          }, 2500)
        }, resetAll: function () {
          this.syncReady = this.durationChange = this.canPlay = !1
        }
      },
      lastcurrenttime: -1,
      currentsyncindex: 0,
      lastevent: null,
      lastlastevent: null,
      lastlastlastevent: null,
      synclist: [],
      synclistindex: 0,
      audioUrl: null,
      backupUrl: null,
      frameUrl: null,
      timer: null,
      postMessageData: [],
      runningRefresh: !1,
      handlers: {
        init: function () {
          rspkr.log("[rspkr.HL.html5.handlers.init]");
          var c = Math.random(), a = {};
          a.audioformat = rspkr.Common.data.browser.html5AudioFormat;
          a.requestgrouptype = "html5iframe";
          a.requestgroup = c;
          rspkr.HL.html5.backupUrl = rspkr.Common.data.getAudioLink(a);
          (!0 === rspkr.cfg.item("general.usePost") || 0 < rspkr.Common.data.selectedText.length || 0 < rspkr.Common.data.selectedHTML.length) && "iOS" !== rspkr.Common.data.browser.OS && "Android" !== rspkr.Common.data.browser.OS ? rspkr.HL.html5.timer = setTimeout(function () {
            rspkr.HL.html5.initSyncFrame(a);
            rspkr.HL.html5.initAudio();
            clearTimeout(rspkr.HL.html5.timer)
          }, 2E3) : (rspkr.log("Normal audio init!"), rspkr.HL.html5.initSyncFrame(a),
            rspkr.HL.html5.initAudio())
        }, play: function () {
          rspkr.log("[rspkr.HL.html5.handlers.play]");
          rspkr.HL.Type.CURRENT == rspkr.HL.Type.CLIENT_MARKUP && rspkr.hl.html5.States.CURRENT == rspkr.hl.html5.States.STOPPED ? (rspkr.hl.html5.States.setState(rspkr.hl.html5.States.BEGIN), rspkr.PlayerAPI.playerRef.pause(), rspkr.HL.html5.handlers.runPostMessages()) : rspkr.HL.Type.CURRENT == rspkr.HL.Type.SERVER_MARKUP && rspkr.hl.html5.States.CURRENT == rspkr.hl.html5.States.STOPPED ? rspkr.hl.State.setState(rspkr.hl.State.RELOAD) ? this.init() :
            (rspkr.hl.html5.States.setState(rspkr.hl.html5.States.BEGIN), rspkr.PlayerAPI.playerRef.pause(), rspkr.HL.html5.handlers.runPostMessages()) : (rspkr.hl.html5.States.CURRENT = rspkr.hl.html5.States.USER_START_PLAYING, rspkr.hl.html5.refresh())
        }, pause: function () {
          rspkr.hl.html5.States.setState(rspkr.hl.html5.States.NOT_PLAYING);
          rspkr.hl.html5.lastcurrenttime = 0
        }, release: function () {
          rspkr.log("[rspkr.HL.html5.handlers.release]");
          rspkr.HL.html5.synclist = [];
          rspkr.HL.html5.synclistindex = 0;
          rspkr.HL.html5.currentsyncindex =
            0;
          rspkr.HL.html5.lastcurrenttime = -1;
          rspkr.HL.html5.audioUrl = null;
          rspkr.HL.html5.backupUrl = null;
          rspkr.HL.html5.frameUrl = null;
          rspkr.HL.html5.postMessageData = [];
          rspkr.HL.html5.Events.resetAll();
          rspkr.PlayerAPI.playerRef && rspkr.PlayerAPI.playerRef.removeEventListener("ended", rshlexit, !1);
          rspkr.PlayerAPI.playerRef = null;
          var c = document.getElementById("ReadSpeaker_sync_iframe");
          c && (c.src = "about:blank")
        }, stop: function () {
          rspkr.hl.html5.States.setState(rspkr.hl.html5.States.STOPPED);
          rspkr.HL.html5.lastcurrenttime = -1;
          rspkr.HL.html5.currentsyncindex = 0
        }, updateTime: function () {
          rspkr.log("[rspkr.HL.html5.handlers.updateTime]");
          rspkr.hl.html5.States.setState(rspkr.hl.html5.States.NOT_PLAYING);
          rspkr.HL.html5.lastcurrenttime = rspkr.PlayerAPI.playerRef.currentTime;
          rspkr.HL.html5.currentsyncindex = 0;
          rspkr.HL.html5.handlers.setCurrentSyncIndex();
          rspkr.hl.html5.States.setState(rspkr.hl.html5.States.USER_START_PLAYING)
        }, runPostMessages: function () {
          rspkr.log("[rspkr.HL.html5.handlers.runPostMessages]");
          var c = rspkr.HL.html5.postMessageData,
            a;
          for (a in c)null !== c[a - 1] && "rshlsetContent" == c[a] ? rspkr.HL.sync.setContent(rspkr.Common.base64.decode(c[a - 1])) : null !== c[a - 1] && "rshlsetId" == c[a] ? rspkr.HL.sync.setId(c[a - 1]) : "rshlinit" == c[a] && (rspkr.HL.sync.init(), rspkr.PlayerAPI.playerRef.play(), rspkr.HL.html5.refresh())
        }, setCurrentSyncIndex: function () {
          if (0 < rspkr.HL.html5.synclist.length && rspkr.HL.html5.synclist[rspkr.HL.html5.currentsyncindex])for (; 20 >= 1 * rspkr.HL.html5.synclist[rspkr.HL.html5.currentsyncindex][0] - 1E3 * rspkr.PlayerAPI.playerRef.currentTime;)rspkr.HL.html5.currentsyncindex++
        },
        totalTime: function () {
          var c = rspkr.PlayerAPI.playerRef;
          if (c)if ("Opera" !== rspkr.Common.data.browser.name && c.buffered && c.buffered.end)try {
            return 0 < c.buffered.length ? c.buffered.end(c.buffered.length - 1) : c.buffered.end(0)
          } catch (a) {
            return c.duration && "infinity" !== c.duration.toString().toLowerCase() && "NaN" !== c.duration ? c.duration : c.currentTime + 15
          } else return c.duration && "infinity" !== c.duration.toString.toLowerCase() && "NaN" !== c.duration ? c.duration : c.currentTime + 15
        }
      },
      initAudio: function () {
        rspkr.HL.html5.audioUrl ||
        (rspkr.HL.html5.audioUrl = rspkr.HL.html5.backupUrl);
        rspkr.log("[rspkr.html5.initAudio] Audio URL: " + rspkr.HL.html5.audioUrl, 1);
        rspkr.PlayerAPI.playerRef = new Audio(rspkr.HL.html5.audioUrl);
        var c = rspkr.PlayerAPI.playerRef;
        c.loop = !1;
        c.preload = "auto";
        c.volume = parseFloat((rspkr.st.get("hlvol") || 100) / 100);
        rspkr.devt("onVolumeAdjusted", window);
        rspkr.PlayerAPI.playerRef.play();
        rspkr.PlayerAPI.playerRef.pause();
        c.addEventListener("canplay", function () {
          rspkr.hl.html5.Events.onCanPlay()
        }, !1);
        c.addEventListener("durationchange",
          function () {
            rspkr.log("[rspkr.hl.html5.initAudio] Durationchange occurred", 1);
            1 == rspkr.HL.html5.handlers.totalTime() && !0 == rspkr.PlayerAPI.playerRef.paused ? rspkr.HL.html5.initAudio() : (0 === rspkr.HL.html5.handlers.totalTime() && rspkr.pl.playerRef.play(), rspkr.hl.html5.Events.onDurationChange(), rspkr.PlayerAPI.playerRef.addEventListener("ended", function () {
              window.rshlexit("false")
            }, !1))
          }, !1);
        rspkr.pl.checkNetworkStatus();
        rspkr.hl.html5.States.setState(rspkr.hl.html5.States.BEGIN)
      },
      initSyncFrame: function (c) {
        if ("none" !=
          rspkr.Common.data.sync) {
          var a = null;
          document.getElementById("ReadSpeaker_sync_iframe") ? a = document.getElementById("ReadSpeaker_sync_iframe") : (a = document.createElement("iframe"), a.setAttribute("id", "ReadSpeaker_sync_iframe"));
          !rspkr.HL.html5.frameUrl && (!0 === rspkr.cfg.item("general.usePost") || 0 < rspkr.Common.data.selectedText.length || 0 < rspkr.Common.data.selectedHTML.length) ? rspkr.HL.html5.frameUrl = rspkr.HL.html5.backupUrl + "sync" : rspkr.HL.html5.frameUrl || (c.audioformat = "html5iframe", rspkr.HL.html5.frameUrl =
            rspkr.Common.data.getAudioLink(c));
          rspkr.log("[rspkr.HL.html5.initSyncFrame] Audio URL: " + rspkr.HL.html5.frameUrl);
          a.src = rspkr.HL.html5.frameUrl;
          a.type = "text/javascript";
          a.height = 0;
          a.width = 0;
          a.style.display = "none";
          document.body.appendChild(a)
        } else rspkr.hl.html5.States.setState(rspkr.hl.html5.States.USER_START_PLAYING), rspkr.PlayerAPI.playerRef.play()
      },
      receiveMessage: function (c) {
        c.origin.match(/readspeaker.?.com/gi) && (rspkr.HL.html5.postMessageData.push(c.data), !/android|ios/i.test(rspkr.Common.data.browser.OS) &&
        "rshlfinished" == c.data && (rspkr.HL.html5.timer && clearTimeout(rspkr.HL.html5.timer), rspkr.HL.html5.initSyncFrame(), rspkr.HL.html5.initAudio()), -1 != c.data.indexOf("." + rspkr.Common.data.browser.html5AudioFormat) ? rspkr.HL.html5.audioUrl = c.data : -1 != c.data.indexOf(".html5iframe") ? rspkr.HL.html5.frameUrl = c.data : "rshlaudio" != c.data && "rshlhtml5sync" != c.data && (null != rspkr.HL.html5.lastevent && "rshlsetContent" == c.data ? (rspkr.HL.html5.synclist = [], rspkr.HL.html5.synclistindex = 0, rspkr.HL.sync.setContent(rspkr.Common.base64.decode(rspkr.HL.html5.lastevent.data))) :
          null != rspkr.HL.html5.lastevent && "rshlsetId" == c.data ? rspkr.HL.sync.setId(rspkr.HL.html5.lastevent.data) : "rshlinit" == c.data ? (rspkr.HL.sync.init(), rspkr.hl.html5.Events.onSyncReady()) : null != rspkr.HL.html5.lastlastlastevent && (null != rspkr.HL.html5.lastlastevent && null != rspkr.HL.html5.lastevent && "rshlsync" == c.data) && (rspkr.HL.html5.synclist[rspkr.HL.html5.synclistindex] = [rspkr.HL.html5.lastlastlastevent.data, rspkr.HL.html5.lastlastevent.data, rspkr.HL.html5.lastevent.data], rspkr.HL.html5.synclistindex++),
          rspkr.HL.html5.lastlastlastevent = rspkr.HL.html5.lastlastevent, rspkr.HL.html5.lastlastevent = rspkr.HL.html5.lastevent, rspkr.HL.html5.lastevent = c))
      },
      refresh: function () {
        var c = rspkr.PlayerAPI.playerRef, a = rspkr.HL.html5;
        !c || a.States.CURRENT == a.States.STOPPED ? (rspkr.log("[rspkr.hl.html5.refresh] Audio is undefined or player is stopped", 2), a.runningRefresh = !1) : (a.States.CURRENT == a.States.NOT_PLAYING && setTimeout(function () {
          a.refresh()
        }, 500), 0 < c.currentTime && parseInt(a.lastcurrenttime) > parseInt(c.currentTime) ?
          (rspkr.log("[rspkr.hl.html5.refresh] An error has occured. Player is stopped.", 2), rspkr.ui.getActivePlayer().stop(), a.runningRefresh = !1) : (a.lastcurrenttime = c.currentTime, a.runningRefresh = !0, a.States.CURRENT == a.States.BEGIN ? (rspkr.hl.html5.States.setState(a.States.USER_START_NOT_READY), setTimeout(function () {
          a.refresh()
        }, 200)) : a.States.CURRENT == a.States.USER_START_NOT_READY ? a.synclist[a.currentsyncindex] && 1 < a.handlers.totalTime() && a.synclist[a.currentsyncindex][0] < 1E3 * a.handlers.totalTime() ? (rspkr.hl.html5.States.setState(a.States.USER_START_PLAYING),
          c.play(), setTimeout(function () {
          a.refresh()
        }, 50)) : 0 === a.handlers.totalTime() ? (c.play(), setTimeout(function () {
          a.refresh()
        }, 250)) : a.synclist[a.currentsyncindex] ? 20 >= 1 * a.synclist[a.currentsyncindex][0] - 1E3 * c.currentTime ? setTimeout(function () {
          a.refresh()
        }, 0) : (c = 1 * a.synclist[a.currentsyncindex][0] - 1E3 * c.currentTime - 20, 75 < c ? setTimeout(function () {
          a.refresh()
        }, 75) : 0 > c ? setTimeout(function () {
          a.refresh()
        }, 0) : setTimeout(function () {
          a.refresh()
        }, c)) : setTimeout(function () {
          a.refresh()
        }, 75) : a.States.CURRENT == a.States.USER_START_PLAYING &&
        (a.synclist[a.currentsyncindex] && 1 * a.synclist[a.currentsyncindex][0] - 20 < 1E3 * c.currentTime && (rspkr.HL.sync.execute(a.synclist[a.currentsyncindex][1], a.synclist[a.currentsyncindex][2]), a.currentsyncindex++), a.synclist[a.currentsyncindex] ? 20 >= 1 * a.synclist[a.currentsyncindex][0] - 1E3 * c.currentTime ? setTimeout(function () {
          a.refresh()
        }, 0) : (c = 1 * a.synclist[a.currentsyncindex][0] - 1E3 * c.currentTime - 20, 75 < c ? setTimeout(function () {
          a.refresh()
        }, 75) : 0 > c ? setTimeout(function () {
          a.refresh()
        }, 0) : setTimeout(function () {
            a.refresh()
          },
          c)) : setTimeout(function () {
          a.refresh()
        }, 75))))
      }
    }, Preserve: {
      cls: "rs_preserve", testElem: null, elementShelter: [], formShelter: [], formData: function (c, a, b, e, f) {
        this.name = c;
        this.type = a;
        this.value = b;
        this.checked = e;
        this.selectedIndex = f;
        this.selectedOptions = []
      }, moveToShelter: function (c) {
        rspkr.log("[rspkr.HL.Preserve.moveToShelter]");
        var a = [], b = [], e = null, f;
        (f = $rs.findIn(c, "." + rspkr.HL.Preserve.cls)) && !$rs.isArray(f) && (f = [f]);
        for (var d = 0, j = f.length; d < j; d++)e = $rs.get(f[d]).cloneNode(!1), f[d].parentNode.insertBefore(e,
          f[d]), a.push($rs.detach(f[d]));
        rspkr.log("[rspkr.hl.Preserve] Moved " + d + " nodes to the shelter.");
        c = $rs.findIn(c, "input, select");
        for (d = 0; d < c.length; d++) {
          e = new rspkr.HL.Preserve.formData(c[d].name, c[d].type, c[d].value, c[d].checked, c[d].selectedIndex);
          if ("select-multiple" == c[d].type) {
            f = c[d].options;
            for (var j = [], p = 0; p < f.length; p++)j.push(f[p].selected);
            e.selectedOptions = j
          }
          b.push(e)
        }
        rspkr.HL.Preserve.elementShelter.push(a);
        rspkr.HL.Preserve.formShelter.push(b)
      }, restoreFromShelter: function (c) {
        var a, b,
          e;
        rspkr.log("[rspkr.HL.Preserve.restoreFromShelter]");
        if (rspkr.HL.Preserve.elementShelter.length && (e = rspkr.HL.Preserve.elementShelter.shift(), e.length)) {
          (a = $rs.findIn(c, "." + rspkr.HL.Preserve.cls)) && !$rs.isArray(a) && (a = [a]);
          for (var d = 0, g = a.length; d < g; d++)b = e.shift(), a[d].parentNode.insertBefore(b, a[d]), a[d].parentNode.removeChild(a[d])
        }
        if (rspkr.HL.Preserve.formShelter.length && (c = $rs.findIn(c, "input, select"), a = rspkr.HL.Preserve.formShelter.shift(), c.length && a.length && c.length === a.length))for (d = 0; d <
        c.length; d++)if (c[d].name === a[d].name)switch (c[d].type) {
          case "text":
            c[d].value = a[d].value;
            break;
          case "password":
            c[d].value = a[d].value;
            break;
          case "radio":
            !0 === a[d].checked && (c[d].checked = !0);
            break;
          case "checkbox":
            c[d].checked = a[d].checked;
            break;
          case "select-one":
            c[d].selectedIndex = a[d].selectedIndex;
            break;
          case "select-multiple":
            b = c[d].options;
            for (e = 0; e < b.length; e++)b[e].selected = a[d].selectedOptions[e]
        }
      }, clearShelter: function () {
        rspkr.log("[rspkr.HL.Preserve.clearShelter]");
        rspkr.HL.Preserve.elementShelter =
          [];
        rspkr.HL.Preserve.formShelter = []
      }
    }, Restore: {
      Storage: {readClass: [], readId: [], restoreContent: []}, all: function () {
        rspkr.log("[rspkr.HL.Restore.all]");
        var a = rspkr.HL.Restore.Storage, b = [], b = null, e = /sync_(word|sent)/gi;
        if (0 < a.readId.length && 0 < a.restoreContent.length) {
          rspkr.c.dispatchEvent("onBeforeContentChange", window);
          for (var d = 0; d < a.readId.length; d++)for (var f = 0; f < a.readId[d].length; f++)b = $rs.get("#" + a.readId[d][f]), !0 === e.test(b.innerHTML) && (rspkr.HL.Preserve.moveToShelter(b), b.innerHTML = a.restoreContent[d][f],
            rspkr.HL.Preserve.restoreFromShelter(b));
          rspkr.c.dispatchEvent("onAfterContentChange", window)
        } else if (0 < a.readClass.length && 0 < a.restoreContent.length) {
          rspkr.c.dispatchEvent("onBeforeContentChange", window);
          for (d = 0; d < a.readClass.length; d++) {
            rspkr.HL.Preserve.clearShelter();
            b = $rs.get("." + a.readClass[d]);
            for (f = 0; f < b.length; f++)!0 === e.test(b[f].innerHTML) && (rspkr.HL.Preserve.moveToShelter(b[f]), b[f].innerHTML = a.restoreContent[d][f], rspkr.HL.Preserve.restoreFromShelter(b[f]))
          }
          rspkr.c.dispatchEvent("onAfterContentChange",
            window)
        } else rspkr.log("No stored content exists!", 2)
      }, checkContent: function () {
        rspkr.log("[rspkr.hl.Restore.checkContent]", 1);
        !1 === this.hasMarkup() && (rspkr.hl.State.CURRENT == rspkr.hl.State.STOPPED && rspkr.HL.Type.CURRENT == rspkr.HL.Type.SERVER_MARKUP) && (this.clearRestoreContent(), this.setRestoreContent(), rspkr.pl.releaseAdapter(), rspkr.hl.State.setState(rspkr.hl.State.RELOAD))
      }, hasMarkup: function () {
        var a = rspkr.HL.Restore.Storage, b = [], b = null, d = /sync_(word|sent)/gi;
        if (0 < a.readId.length && 0 < a.restoreContent.length)for (var e =
          0; e < a.readId.length; e++)for (var f = 0; f < a.readId[e].length; f++) {
          if (b = $rs.get("#" + a.readId[e][f]), !0 === d.test(b.innerHTML))return !0
        } else if (0 < a.readClass.length && 0 < a.restoreContent.length)for (e = 0; e < a.readClass.length; e++) {
          rspkr.HL.Preserve.clearShelter();
          b = $rs.get("." + a.readClass[e]);
          for (f = 0; f < b.length; f++)if (!0 === d.test(b[f].innerHTML))return !0
        }
        return !1
      }, clearRestoreContent: function () {
        rspkr.log("[rspkr.HL.Restore.clearRestoreContent] Called!")
      }, setRestoreContent: function () {
        rspkr.log("[rspkr.HL.Restore.setRestoreContent] Called!");
        var a = rspkr.HL.Restore.Storage, b = [], d = [], e = /sync_(word|sent|user)/gi, f = a.restoreContent;
        0 === a.readClass.length && 0 === a.readId.length && rspkr.HL.Restore.getReadData();
        if (0 < a.readClass.length)for (var g = 0; g < a.readClass.length; g++)b.push($rs.get("." + a.readClass[g])); else if (0 < a.readId.length)for (g = 0; g < a.readId.length; g++) {
          for (var j = 0; j < a.readId[g].length; j++)d.push($rs.get("#" + a.readId[g][j]));
          b.push(d);
          d = []
        } else rspkr.log("ERR: Could not set restore content or find the read area data", 3);
        a.restoreContent =
          [];
        for (g = 0; g < b.length; g++) {
          for (j = 0; j < b[g].length; j++)!1 === e.test(b[g][j].innerHTML) ? d.push(b[g][j].innerHTML) : 0 < f.length ? d.push(f[g][j]) : d.push(b[g][j].innerHTML);
          a.restoreContent.push(d);
          d = []
        }
      }, getReadData: function () {
        rspkr.log("[rspkr.HL.Restore.getReadData]");
        for (var a = rspkr.HL.Restore.Storage, b = $rs.get("a"), d = 0, e = b.length; d < e; d++)if (b[d].getAttribute("href") && -1 !== b[d].getAttribute("href").indexOf(rspkr.cfg.item("general.domain") + "/cgi-bin/" + rspkr.cfg.item("general.rsent")) && "rsSaveBtn" !== b[idx].id &&
          "rs_selimg" !== b[idx].id)if (-1 !== b[d].getAttribute("href").search(/readclass=/)) {
          var f = b[d].getAttribute("href").match(/readclass=[^&]+/gi)[0].replace("readclass=", "");
          rspkr.HL.Restore.Storage.readClass.push(f)
        } else if (-1 !== b[d].getAttribute("href").search(/readid=/)) {
          for (var f = b[d].getAttribute("href").match(/readid=[^&]+/gi)[0].replace("readid=", "").split(","), g = [], j = 0; j < f.length; j++)g.push(f[j]);
          rspkr.HL.Restore.Storage.readId.push(g)
        }
        0 === a.readClass.length && 0 === a.readId.length && (rspkr.c.data.params.hasOwnProperty("readid") ?
          a.readId.push([rspkr.c.data.params.readid]) : rspkr.c.data.params.hasOwnProperty("readclass") && a.readClass.push([rspkr.c.data.params.readclass]))
      }
    }, Scroll: {
      currentSpan: null, timer: null, useScroll: !1, userScrollTimer: null, stopped: !0, getScrollY: function () {
        var a = 0;
        "number" == typeof document.pageYOffset ? a = document.pageYOffset : document.documentElement && document.documentElement.scrollTop && 0 < document.documentElement.scrollTop ? a = document.documentElement.scrollTop : document.body && document.body.scrollTop && (a = document.body.scrollTop);
        return a
      }, getWindowHeight: function () {
        var a = 0;
        "number" == typeof window.innerHeight ? a = window.innerHeight : document.documentElement && document.documentElement.clientHeight && 0 < document.documentElement.clientHeight ? a = document.documentElement.clientHeight : document.body && document.body.clientHeight && (a = document.body.clientHeight);
        return a + 30
      }, userScroll: function () {
        rspkr.HL.Scroll.timer && (clearTimeout(rspkr.HL.Scroll.timer), rspkr.HL.Scroll.timer = null);
        rspkr.HL.Scroll.userScrollTimer && clearTimeout(rspkr.HL.Scroll.userScrollTimer);
        rspkr.HL.Scroll.userScrollTimer = setTimeout(function () {
          rspkr.HL.Scroll.userScrollTimer = null
        }, 5E3)
      }, stopTimer: function () {
        rspkr.log("[rspkr.Hl.Scroll.stopTimer] Called!");
        rspkr.HL.Scroll.timer && (clearTimeout(rspkr.HL.Scroll.timer), rspkr.HL.Scroll.timer = null);
        rspkr.HL.Scroll.stopped = !0
      }, initScroll: function () {
        "scrollon" == rspkr.Common.Settings.get("hlscroll") ? (rspkr.log("[rspkr.HL.Sroll.initScroll] Scroll initiated!"), rspkr.HL.Scroll.useScroll = !0, rspkr.evt("onUIClosePlayer", rspkr.HL.Scroll.stopTimer), rspkr.evt("onUIStop",
          rspkr.HL.Scroll.stopTimer), rspkr.evt("onUIPause", rspkr.HL.Scroll.stopTimer), rspkr.evt("onUISliderMove", rspkr.HL.Scroll.userScroll), rspkr.evt("onFocusIn", rspkr.HL.Scroll.userScroll), rspkr.evt("onFocusOut", rspkr.HL.Scroll.userScroll), document.addEventListener ? document.addEventListener("scroll", function () {
          setTimeout(function () {
            rspkr.HL.Scroll.userScroll()
          }, 0)
        }, !1) : document.attachEvent ? document.attachEvent("onscroll", rspkr.HL.Scroll.userScroll) : document.onscroll = rspkr.HL.Scroll.userScroll) : this.useScroll = !1
      }, execScroll: function (a) {
        this.useScroll && (this.currentSpan = a, !0 === this.stopped && (this.stopped = !1), this.timer || (rspkr.log("[rspkr.hl.Scroll] execScroll"), this.timer = setTimeout(function () {
          rspkr.HL.Scroll.timer = null;
          rspkr.HL.Scroll.triggerScroll(rspkr.HL.Scroll.currentSpan)
        }, 500)))
      }, triggerScroll: function (a) {
        rspkr.log("[rspkr.HL.Scroll.triggerScroll] timer: " + rspkr.hl.Scroll.userScrollTimer + ", stopped: " + rspkr.HL.Scroll.stopped);
        !rspkr.HL.Scroll.userScrollTimer && !1 === rspkr.HL.Scroll.stopped && rspkr.u.scroll.scrollToElm(a)
      }
    },
    State: {
      CURRENT: 1, READY: 1, STOPPED: 2, PLAYING: 3, RELOAD: 4, setState: function (a) {
        this.CURRENT = a;
        rspkr.log("[rspkr.hl.html5.States.setState] Changing state from " + this.CURRENT + " to " + a, 1)
      }
    }, sync: {
      init: function () {
        rspkr.c.dispatchEvent("onBeforeSyncInit", window);
        e.hlChanged = !1;
        if (0 < rspkr.Common.data.selectedText.length || 0 < rspkr.Common.data.selectedHTML.length)rspkr.log("[rspkr.HL._sync.init] client markup"), rspkr.HL.Type.CURRENT = rspkr.HL.Type.CLIENT_MARKUP, a.firstRun = 1, "explorer" == b ? document.selection.empty() :
          a.preProcess.identifyElementsReplacementNode(document.body); else if (rspkr.log("[rspkr.HL._sync.init] server markup"), rspkr.HL.Type.CURRENT = rspkr.HL.Type.SERVER_MARKUP, "none" != rspkr.Common.data.sync) {
          var c = [], d = [], k = document.createElement("DIV");
          k.innerHTML = rspkr.HL.markedUpHTML;
          if (rspkr.c.data.params.hasOwnProperty("readclass"))d = $rs.findIn(k, "." + rspkr.c.data.params.readclass), c = $rs.get("." + rspkr.c.data.params.readclass); else if (rspkr.c.data.params.hasOwnProperty("readid"))for (var l = rspkr.c.data.params.readid.split(","),
                                                                                                                                                                                                                                     f = 0; f < l.length; f++) {
            var g = $rs.findIn(k, "#" + l[f]);
            $rs.isArray(g) && 0 === g.length ? d.push(k) : d.push(g);
            c.push($rs.get("#" + l[f]))
          }
          rspkr.log("[rspkr.HL.sync.init] readElements length: " + c.length);
          rspkr.c.dispatchEvent("onBeforeContentChange", window);
          for (f = 0; f < c.length; f++)rspkr.HL.Preserve.moveToShelter(c[f]), c[f].innerHTML = d[f].innerHTML, rspkr.HL.Preserve.restoreFromShelter(c[f]);
          rspkr.c.dispatchEvent("onAfterContentChange", window);
          rspkr.HL.Preserve.clearShelter()
        }
        rspkr.HL.markedUpHTML = "";
        rspkr.c.post.removeIframe();
        rspkr.c.dispatchEvent("onAfterSyncInit", window)
      }, lightCleanUp: function () {
        rspkr.log("[rspkr.HL._sync.lightCleanUp] Called! " + rspkr.HL.Type.CURRENT);
        rspkr.HL.Type.CURRENT == rspkr.HL.Type.CLIENT_MARKUP && !0 === e.hlChanged ? a.postProcess.settingsCleanUp() : rspkr.HL.Type.CURRENT == rspkr.HL.Type.CLIENT_MARKUP && !1 === e.hlChanged || 0 < rspkr.Common.data.selectedText.length ? a.postProcess.lightCleanUp() : rspkr.HL.Type.CURRENT == rspkr.HL.Type.SERVER_MARKUP && d.postProcess.lightCleanUp()
      }, fullCleanUp: function () {
        rspkr.log("[rspkr.HL._sync.fullCleanUp] Called!");
        rspkr.log("[rspkr.HL._sync.fullCleanUp] Called!", 5);
        rspkr.HL.Type.CURRENT == rspkr.HL.Type.CLIENT_MARKUP && a.postProcess.fullCleanUp();
        d.postProcess.fullCleanUp()
      }, setId: function () {
        rspkr.log("[rspkr.HL._sync.setId] Called!")
      }, setContent: function (a) {
        rspkr.log("[rspkr.HL._sync.setContent] Called!");
        rspkr.HL.markedUpHTML += a
      }, execute: function (a, b) {
        var d = rspkr.Common.Settings;
        if (!("none" === d.get("hl") || "hloff" === d.get("hltoggle"))) {
          if (rspkr.HL.Type.CURRENT == rspkr.HL.Type.SERVER_MARKUP) {
            var e = $rs.hasClass($rs.get("#sync" +
              b), "sync_sent") ? "sent" : "word";
            if ("sent" === d.get("hl") && "word" === e || "word" === d.get("hl") && "sent" === e)return
          }
          rspkr.c.dispatchEvent("onBeforeSync", window);
          rspkr.HL.Type.CURRENT == rspkr.HL.Type.CLIENT_MARKUP ? (d = rspkr.cfg.item("general.selectionEngine")) && "old" !== d ? rspkr.HL.clientMarkup.syncNew(a, b) : rspkr.HL.clientMarkup.sync(a, b) : rspkr.HL.serverMarkup.sync(a, b);
          rspkr.c.dispatchEvent("onAfterSync", window)
        }
      }
    }, settings: e, Type: {CURRENT: 0, DEFAULT: 0, SERVER_MARKUP: 1, CLIENT_MARKUP: 2}
  }
}();
rspkr.HL.engine || (rspkr.HL.engine = {});
rspkr.HL.engine.explorer = function () {
  return {
    clientExtension: {
      firstRun: 0,
      previousWord: {},
      previousSent: {},
      selectionRange: null,
      selectionHTML: null,
      selectedWordsRange: [],
      wordsRangeClasses: [],
      preProcess: {
        bookMarkIndex: 1,
        endNode: null,
        endOffset: null,
        exludednodes: "table tr select option textarea ul ol dl thead tbody tfoot colgroup script map optgroup".split(" "),
        firstRun: 0,
        inc: 0,
        numberOfSelections: 0,
        startNode: null,
        startOffset: null,
        init: function () {
          this.numberOfSelections++;
          rspkr.Common.data.selectedHTML = "old" !==
          rspkr.cfg.item("general.selectionEngine") ? this.buildMarkupNew(rspkr.Common.data.selectedRange) : this.buildMarkup(rspkr.Common.data.selectedRange)
        },
        buildMarkup: function (b) {
          for (var a = rspkr.c.data.getParam("lang"), d = !1, e = null, c = rspkr.cfg.item("general.sentOnlyLang"), h = 0; h < c.length; h++)if (a && a.toLowerCase() === c[h]) {
            d = !0;
            break
          }
          var a = b.duplicate(), h = 0, c = "", k = 1, l = 0, f = 0, g = "", j = "";
          b.moveStart("word", -1);
          b.moveStart("word", 1);
          a.isEqual(b) || b.moveStart("word", -1);
          a = b.duplicate();
          b.moveEnd("word", 1);
          b.moveEnd("word",
            -1);
          a.isEqual(b) || b.moveEnd("word", 1);
          rspkr.HL.clientMarkup.selectionRange = b.duplicate();
          var p = b.parentElement(), t = b.duplicate();
          t.collapse(!1);
          a = b.duplicate();
          a.collapse();
          for (d && (e = b.text.split(RegExp(decodeURIComponent("%e3%80%81") + "|" + decodeURIComponent("%e3%80%82") + "|\\s|\\n"))); b.inRange(a) && 0 != b.compareEndPoints("EndToEnd", a);) {
            f++;
            h++;
            if (1E4 < h)break;
            d ? (a = b.duplicate(), a.findText(e[f - 1])) : (a.collapse(!1), a.expand("word", 1));
            j = g = "";
            t.collapse(!1);
            var r = a.duplicate();
            r.collapse(!1);
            if (0 == t.compareEndPoints("StartToStart",
                r) && 0 == t.compareEndPoints("EndToEnd", r) && r.htmlText == t.htmlText) {
              l++;
              if (2 > l)a.move("character", 1); else if (4 > l)a.move("character", 2); else if (6 > l)a.move("word", 1); else if (8 > l)a.move("word", 2); else if (10 > l)a.move("sentence", 1); else if (12 > l)a.move("sentence", 2); else break;
              a.collapse(!1)
            } else {
              l = 0;
              if (-1 === f)return a;
              rspkr.HL.clientMarkup.selectedWordsRange[f] = a.duplicate();
              t = a.text;
              r = a.htmlText;
              a.collapse(!1);
              var n;
              1 === k ? (lastPos = a.duplicate(), n = this.iterateParentTree(lastPos.parentElement(), document.body,
                p, 0)) : n = this.iterateParentTree(a.parentElement(), lastPos.parentElement(), p, 0);
              for (var u = this.iterateParentTree(lastPos.parentElement(), a.parentElement(), p, 0), m = a.parentElement(), s = 0; s < n && 20 > s; s++)m.className.match("sync_") || (g = m.outerHTML.match("<[^>]*>")[0] + g), m = m.parentElement;
              m = lastPos.parentElement();
              for (s = 0; s < u && 20 > s; s++)m.className.match("sync_") || (j += "</" + m.tagName + ">"), m = m.parentElement;
              if (0 != n || 0 != u)lastPos = a.duplicate();
              1 === k ? (c += g, k = 0) : c += j + g;
              "" != r.replace("sync_sent_highlighted", "") &&
              (c += "<" + rspkr.Common.data.browser.syncContainer + ' class="sync_user" id="sync' + f + '">' + t + "</" + rspkr.Common.data.browser.syncContainer + ">");
              t = a.duplicate()
            }
          }
          c += "<\!-- f --\>";
          u = this.iterateParentTree(lastPos.parentElement(), document.body, p, 0);
          m = lastPos.parentElement();
          for (s = 0; s < u; s++)m.className.match("sync_") || (c += "</" + m.tagName + ">"), m = m.parentElement;
          a.collapse();
          return c
        },
        buildMarkupNew: function (b) {
          for (var a = rspkr.c.data.getParam("lang"), d = !1, e = rspkr.cfg.item("general.sentOnlyLang"), c = 0; c < e.length; c++)if (a &&
            a.toLowerCase() === e[c]) {
            d = !0;
            break
          }
          var a = b.duplicate(), c = 0, e = "", h = 1, k = 0, l = 0, f = "", g = "", j = "", p = null;
          rspkr.HL.clientMarkup.selectionRange = b.duplicate();
          var t = b.parentElement(), r = b.duplicate(), f = b.duplicate();
          r.collapse(!1);
          a.collapse();
          var n = [], g = f.duplicate(), j = f.duplicate();
          f.moveStart("sentence", -1);
          f.moveStart("sentence", 1);
          g.isEqual(f) || f.moveStart("sentence", -1);
          g = f.duplicate();
          f.moveEnd("sentence", 1);
          f.moveEnd("sentence", -1);
          g.isEqual(f) || f.moveEnd("sentence", 1);
          g = f.duplicate();
          j.collapse(!0);
          for (f.collapse(!0); g.inRange(f) && 0 != g.compareEndPoints("EndToEnd", f);) {
            j.expand("sentence", 1);
            if (!0 === j.isEqual(f) || 0 === j.compareEndPoints("EndToEnd", f))break;
            f.expand("sentence", 1);
            n.push(j.duplicate())
          }
          for (; !1 === b.inRange(n[0]) && 0 != b.compareEndPoints("StartToStart", n[0]);)n[0].moveStart("word", 1);
          for (; !1 === b.inRange(n[n.length - 1]) && 0 != b.compareEndPoints("EndToEnd", n[n.length - 1]);)n[n.length - 1].moveEnd("word", -1);
          for (var u = 0; u < n.length; u++) {
            for (j = ""; n[u].inRange(a) && 0 != n[u].compareEndPoints("EndToEnd",
              a);) {
              l++;
              c++;
              if (1E4 < c)break;
              d ? (a = b.duplicate(), a.findText(null[l - 1])) : (a.collapse(!1), a.expand("word", 1));
              g = f = "";
              r.collapse(!1);
              var m = a.duplicate();
              m.collapse(!1);
              if (0 == r.compareEndPoints("StartToStart", m) && 0 == r.compareEndPoints("EndToEnd", m) && m.htmlText == r.htmlText) {
                k++;
                if (2 > k)a.move("character", 1); else if (4 > k)a.move("character", 2); else if (6 > k)a.move("word", 1); else if (8 > k)a.move("word", 2); else if (10 > k)a.move("sentence", 1); else if (12 > k)a.move("sentence", 2); else break;
                a.collapse(!1)
              } else {
                k = 0;
                if (-1 ===
                  l)return a;
                rspkr.HL.clientMarkup.selectedWordsRange[l] = a.duplicate();
                rspkr.HL.clientMarkup.wordsRangeClasses[l] = "word";
                r = a.text;
                m = a.htmlText;
                a.collapse(!1);
                var s;
                1 === h ? (p = a.duplicate(), s = this.iterateParentTree(p.parentElement(), document.body, t, 0)) : s = this.iterateParentTree(a.parentElement(), p.parentElement(), t, 0);
                for (var w = this.iterateParentTree(p.parentElement(), a.parentElement(), t, 0), q = a.parentElement(), v = 0; v < s && 20 > v; v++)!q.className.match("sync_") && !q.className.match("rs_skip") && (f = q.outerHTML.match("<[^>]*>")[0] +
                  f), q = q.parentElement;
                q = p.parentElement();
                for (v = 0; v < w && 20 > v; v++)!q.className.match("sync_") && !q.className.match("rs_skip") && (g += "</" + q.tagName + ">"), q = q.parentElement;
                if (0 != s || 0 != w)p = a.duplicate();
                1 === h ? (j += f, h = 0) : j += g + f;
                "" != m.replace("sync_sent_highlighted", "") && (j += "<" + rspkr.Common.data.browser.syncContainer + ' class="sync_user sync_word" id="sync' + l + '">' + r + "</" + rspkr.Common.data.browser.syncContainer + ">");
                r = a.duplicate()
              }
            }
            l++;
            rspkr.HL.clientMarkup.selectedWordsRange[l] = n[u];
            rspkr.HL.clientMarkup.wordsRangeClasses[l] =
              "sent";
            e += "<" + rspkr.Common.data.browser.syncContainer + ' class="sync_user sync_sent" id="sync' + l + '">';
            e += j;
            e += "</" + rspkr.Common.data.browser.syncContainer + ">\n"
          }
          w = this.iterateParentTree(p.parentElement(), document.body, t, 0);
          q = p.parentElement();
          for (v = 0; v < w; v++)q.className.match("sync_") || (e += "</" + q.tagName + ">"), q = q.parentElement;
          a.collapse();
          return e
        },
        iterateParentTree: function (b, a, d, e) {
          for (var c = a; null !== c;) {
            if (b == d || b == c)return e;
            c = c.parentElement
          }
          e++;
          return this.iterateParentTree(b.parentElement,
            a, d, e)
        }
      },
      postProcess: {
        lightCleanUp: function () {
          rspkr.log("[clientMarkup.postProcess.lightCleanUp] called!");
          for (var b = document.getElementsByTagName(rspkr.Common.data.browser.syncContainer), a = b.length - 1; -1 < a; a--)b[a].className = b[a].className.replace("sync_sent_highlighted", "sync_sent"), b[a].className = b[a].className.replace("sync_word_highlighted", "sync_word"), -1 === b[a].className.toLowerCase().indexOf("sync_user") && b[a].removeAttribute("id");
          var b = rspkr.HL.clientMarkup.previousWord.range, d = rspkr.HL.clientMarkup.previousWord.forecolor,
            e = rspkr.HL.clientMarkup.previousWord.backcolor, c = rspkr.HL.clientMarkup.previousSent.range, h = rspkr.HL.clientMarkup.previousSent.forecolor, k = rspkr.HL.clientMarkup.previousSent.backcolor;
          if (0 < b.length)for (var a = 0, l = b.length; a < l; a++)e[a] && (b[a].execCommand("backcolor", 0, e[a]), d[a] && b[a] && b[a].execCommand("forecolor", 0, d[a]));
          if (0 < c.length) {
            a = 0;
            for (l = c.length; a < l; a++)k[a] && (c[a].execCommand("backcolor", 0, k[a]), h[a] && c[a] && c[a].execCommand("forecolor", 0, h[a]))
          }
          rspkr.hl.clientMarkup.lastWord = null
        }, settingsCleanUp: function () {
          this.lightCleanUp()
        },
        fullCleanUp: function () {
          rspkr.log("[ClientMarkup.postProcess.fullCleanUp] called!");
          this.lightCleanUp();
          rspkr.hl.clientMarkup.selectedWordsRange = [];
          rspkr.hl.clientMarkup.selectionRange = null;
          rspkr.hl.clientMarkup.lastWord = null
        }
      },
      sync: function (b, a) {
        var d = !1, e;
        0 === (b & 2) && (d = 0 != (b & 1) ? !0 : !1);
        1 === this.firstRun && (this.previousWord.range = [], this.previousWord.backcolor = [], this.previousWord.forecolor = [], this.previousSent.range = [], this.previousSent.backcolor = [], this.previousSent.forecolor = []);
        e = this.selectedWordsRange[a];
        if (1 === this.firstRun) {
          this.firstRun = 0;
          if (0 < this.previousSent.range.length) {
            for (var c = 0; c < this.previousSent.range.length; c++)this.previousSent.range[c].execCommand("backcolor", 0, this.previousSent.backcolor[c]), null !== this.previousSent.forecolor[c] && this.previousSent.range[c].execCommand("forecolor", 0, this.previousSent.forecolor[c]);
            this.previousSent.range = [];
            this.previousSent.backcolor = [];
            this.previousSent.forecolor = []
          }
          rspkr.HL.clientMarkup.selectionRange && "wordsent" === rspkr.st.get("hl") && (this.previousSent.range.push(rspkr.HL.clientMarkup.selectionRange),
            this.previousSent.backcolor.push(rspkr.HL.clientMarkup.selectionRange.queryCommandValue("backcolor")), this.previousSent.forecolor.push(rspkr.HL.clientMarkup.selectionRange.queryCommandValue("forecolor")), this.selectionRange.execCommand("backcolor", 0, rspkr.Common.Settings.get("hlsent")), this.selectionRange.execCommand("forecolor", 0, rspkr.cfg.item("settings.hltext")))
        }
        if (!d && 0 < this.previousWord.range.length) {
          for (c = 0; c < this.previousWord.range.length; c++)"word" == rspkr.st.get("hl") || "sent" == rspkr.st.get("hl") ?
            this.previousWord.range[c].execCommand("backcolor", 0, this.previousWord.backcolor[c]) : this.previousWord.range[c].execCommand("backcolor", 0, rspkr.Common.Settings.get("hlsent")), this.previousWord.range[c].execCommand("forecolor", 0, this.previousWord.forecolor[c]);
          this.previousWord.range = [];
          this.previousWord.backcolor = [];
          this.previousWord.forecolor = []
        }
        this.previousWord.backcolor.push(e.queryCommandValue("backcolor"));
        this.previousWord.forecolor.push(e.queryCommandValue("forecolor"));
        this.previousWord.range.push(e);
        "sent" == rspkr.st.get("hl") ? e.execCommand("backcolor", 0, rspkr.Common.Settings.get("hlsent")) : e.execCommand("backcolor", 0, rspkr.Common.Settings.get("hlword"));
        this.lastWord = e;
        e.execCommand("forecolor", 0, rspkr.cfg.item("settings.hltext"))
      },
      syncNew: function (b, a) {
        var d = !1;
        0 === (b & 2) && (d = 0 != (b & 1) ? !0 : !1);
        1 === this.firstRun && (this.previousWord.range = [], this.previousWord.backcolor = [], this.previousWord.forecolor = [], this.previousSent.range = [], this.previousSent.backcolor = [], this.previousSent.forecolor = [], this.firstRun =
          0);
        var e = this.selectedWordsRange[a];
        if (e && "word" === this.wordsRangeClasses[a] && ("word" == rspkr.st.get("hl") || "wordsent" == rspkr.st.get("hl"))) {
          if (0 < this.previousWord.range.length && !d) {
            for (d = 0; d < this.previousWord.range.length; d++)"word" == rspkr.st.get("hl") || "sent" == rspkr.st.get("hl") ? this.previousWord.range[d].execCommand("backcolor", 0, this.previousWord.backcolor[d]) : this.previousWord.range[d].execCommand("backcolor", 0, rspkr.Common.Settings.get("hlsent")), this.previousWord.range[d].execCommand("forecolor",
              0, this.previousWord.forecolor[d]);
            this.previousWord.range = [];
            this.previousWord.backcolor = [];
            this.previousWord.forecolor = []
          }
          this.previousWord.backcolor.push(e.queryCommandValue("backcolor"));
          this.previousWord.forecolor.push(e.queryCommandValue("forecolor"));
          this.previousWord.range.push(e);
          e.execCommand("backcolor", 0, rspkr.Common.Settings.get("hlword"));
          this.lastWord = e;
          e.execCommand("forecolor", 0, rspkr.cfg.item("settings.hltext"))
        } else if (e && "sent" === this.wordsRangeClasses[a] && ("sent" == rspkr.st.get("hl") ||
          "wordsent" == rspkr.st.get("hl"))) {
          if (0 < this.previousWord.range.length) {
            for (d = 0; d < this.previousWord.range.length; d++)this.previousWord.range[d].execCommand("backcolor", 0, this.previousWord.backcolor[d]), this.previousWord.range[d].execCommand("forecolor", 0, this.previousWord.forecolor[d]);
            this.previousWord.range = [];
            this.previousWord.backcolor = [];
            this.previousWord.forecolor = []
          }
          if (0 < this.previousSent.range.length) {
            for (d = 0; d < this.previousSent.range.length; d++)this.previousSent.range[d].execCommand("backcolor",
              0, this.previousSent.backcolor[d]), this.previousSent.range[d].execCommand("forecolor", 0, this.previousSent.forecolor[d]);
            this.previousSent.range = [];
            this.previousSent.backcolor = [];
            this.previousSent.forecolor = []
          }
          this.previousSent.backcolor.push(e.queryCommandValue("backcolor"));
          this.previousSent.forecolor.push(e.queryCommandValue("forecolor"));
          this.previousSent.range.push(e);
          e.execCommand("backcolor", 0, rspkr.Common.Settings.get("hlsent"));
          e.execCommand("forecolor", 0, rspkr.cfg.item("settings.hltext"))
        }
      }
    }
  }
}();
rspkr.HL.engine.gecko = function () {
  return {
    clientExtension: {
      preProcess: {
        bookMarkIndex: 1,
        endNode: null,
        endOffset: null,
        exludednodes: "table tr select option textarea ul ol dl thead tbody tfoot colgroup script map optgroup".split(" "),
        firstRun: 0,
        inc: 0,
        numberOfSelections: 0,
        startNode: null,
        startOffset: null,
        init: function () {
          this.numberOfSelections++;
          var b = "", b = rspkr.Common.data.selectedRange;
          this.startNode = b.startContainer;
          this.endNode = b.endContainer;
          this.startOffset = this.modifyOffsetStartOfWord(this.startNode,
            b.startOffset);
          this.endOffset = this.modifyOffsetEndOfWord(this.endNode, b.endOffset);
          b = this.buildMarkup(b.commonAncestorContainer);
          window.getSelection().removeAllRanges();
          rspkr.Common.data.selectedHTML = b
        },
        buildMarkup: function (b) {
          this.firstRun = 1;
          var a = "", d = this.inc;
          if (3 == b.nodeType)a += this.textMarkup(b); else {
            var e, c = "";
            if (b.hasChildNodes())for (e = 0; e < b.childNodes.length; e++) {
              var h = b.childNodes.item(e);
              if (!("old" !== rspkr.cfg.item("general.selectionEngine") && h.className && -1 !== h.className.indexOf("rs_skip"))) {
                h ==
                this.startNode && (this.inc = 1);
                b == this.startNode && e == this.startOffset && (this.inc = 1);
                8 != h.nodeType && (c += this.buildMarkup(h));
                if (b == this.endNode && e == this.endOffset) {
                  this.inc = 0;
                  break
                }
                if (h == this.endNode) {
                  this.inc = 0;
                  break
                }
              }
            }
            (d || this.inc) && (!b.className || b.className.replace("sync") === b.className && b.id.replace("sync") === b.id) ? (d = document.createElement("div"), d.appendChild(b.cloneNode(!0)), tempdivtag = d.innerHTML.match("<[^>]*>"), null !== tempdivtag && 0 < tempdivtag.length ? (a += tempdivtag[0], a = a + c + ("</" + b.nodeName +
              ">")) : a += c) : a += c;
            if (b.hasChildNodes())for (e = 0; e < b.childNodes.length; e++) {
              if (b === this.endNode && e === this.endOffset) {
                this.inc = 0;
                break
              }
              if (h === this.endNode) {
                this.inc = 0;
                break
              }
            }
          }
          return a
        },
        textMarkup: function (b) {
          var a = !0, d = "", e, c = "", h = "", k = b.nodeValue;
          b === this.startNode && -1 !== this.startOffset && b === this.endNode && -1 !== this.endOffset ? (c = b.nodeValue.substring(0, this.startOffset), k = b.nodeValue.substring(this.startOffset, this.endOffset), h = b.nodeValue.substring(this.endOffset), this.inc = 1) : b === this.startNode && -1 !==
          this.startOffset ? (c = b.nodeValue.substring(0, this.startOffset), k = b.nodeValue.substring(this.startOffset), this.inc = 1) : b === this.endNode && -1 !== this.endOffset && (k = b.nodeValue.substring(0, this.endOffset), h = b.nodeValue.substring(this.endOffset), this.inc = 1);
          if (!this.inc)return "";
          for (e = 0; e < this.exludednodes.length; e++)if (b.parentNode && b.parentNode.nodeName.toLowerCase() === this.exludednodes[e]) {
            a = !1;
            d = this.htmlencode(k);
            break
          }
          b && (b.className && -1 !== b.className.indexOf("rs_skip")) && (a = !1);
          b.parentNode && (b.parentNode.className &&
          -1 !== b.parentNode.className.indexOf("rs_skip")) && (a = !1);
          a && (d = (d = rspkr.cfg.item("general.selectionEngine")) && "old" !== d ? this.markupSentencesNew(this.htmlencode(k), null) : this.markupSentences(this.htmlencode(k), null));
          b === this.endNode && -1 !== this.endOffset && (this.inc = 0);
          a && (null !== b.parentNode && "" !== k) && (a = this.createreplacementnode(c + d + h, getComputedStyle(b.parentNode, null)), b.parentNode.insertBefore(a, b), b.parentNode.removeChild(b));
          return d
        },
        markupSentencesNew: function (b) {
          b = this.splitString(b, [", ",
            ". ", "! ", "? ", decodeURIComponent("%e3%80%81"), decodeURIComponent("%e3%80%82")]);
          if (!b)return "";
          for (var a = "", d = "", e = !1, c = 0; c < b.length; c++)a += "<" + rspkr.Common.data.browser.syncContainer + ' class="sync_user sync_sent cj' + this.numberOfSelections + '" ', a += 'id="sync' + this.bookMarkIndex++ + '">', this.endsWithSpace(b[c]) ? (e = !0, d = b[c].slice(0, -1)) : d = b[c], a += this.markupWords(d), a += "</" + rspkr.Common.data.browser.syncContainer + ">", !0 === e && (a += " "), e = !1;
          return a
        },
        markupSentences: function (b) {
          b = this.splitString(b,
            [", ", ". ", "! ", "? ", decodeURIComponent("%e3%80%81"), decodeURIComponent("%e3%80%82")]);
          if (!b)return "";
          for (var a = "", d = "", e = !1, c = 0; c < b.length; c++)a += "<" + rspkr.Common.data.browser.syncContainer + ' class="ffsent' + this.numberOfSelections + " cj" + this.numberOfSelections + '" ', a += 'id="sync' + this.bookMarkIndex++ + '">', this.endsWithSpace(b[c]) ? (e = !0, d = b[c].slice(0, -1)) : d = b[c], a += this.markupWords(d), !0 === e && (a += " "), a += "</" + rspkr.Common.data.browser.syncContainer + ">", e = !1;
          return a
        },
        markupWords: function (b) {
          b = this.splitString(b,
            " ");
          if (!b)return "";
          for (var a = "", d = "", e = !1, c = 0; c < b.length; c++)a += "<" + rspkr.Common.data.browser.syncContainer + ' class="sync_user sync_word ck' + this.numberOfSelections + '"', a += ' id="sync' + this.bookMarkIndex++ + '">', this.endsWithSpace(b[c]) ? (e = !0, d = b[c].slice(0, -1)) : d = b[c], a += d, a += "</" + rspkr.Common.data.browser.syncContainer + ">", !0 === e && (a += " "), e = !1;
          return a
        },
        trim: function (b) {
          return b.replace(/^\s+|\s+$/g, "")
        },
        htmlencode: function (b) {
          var a = document.createElement("div"), b = document.createTextNode(b);
          a.appendChild(b);
          return a.innerHTML
        },
        identifyElementsReplacementNode: function (b) {
          b.tagName && (b.tagName.toLowerCase() == rspkr.Common.data.browser.syncContainer && b.id) && (rspkr.HL.clientMarkup.selectedWordsRange[b.id] = b);
          if (b.hasChildNodes())for (var a = 0; a < b.childNodes.length; a++)this.identifyElementsReplacementNode(b.childNodes[a])
        },
        createreplacementnode: function (b) {
          var a = document.createElement(rspkr.Common.data.browser.syncContainer);
          a.innerHTML = b;
          a.setAttribute("class", "synctemp cl" + this.numberOfSelections);
          return a
        },
        modifyOffsetStartOfWord: function (b, a) {
          for (var d = [" ", ", ", ". ", "! ", "? ", decodeURIComponent("%e3%80%81"), decodeURIComponent("%e3%80%82")]; b.nodeValue && 0 != a;) {
            for (var e = 0; e < d.length; e++)if (breakstr = d[e], 0 == b.nodeValue.substring(a - 1).indexOf(breakstr))return a;
            a--
          }
          return a
        },
        modifyOffsetEndOfWord: function (b, a) {
          for (var d = [" ", ", ", ". ", "! ", "? ", decodeURIComponent("%e3%80%81"), decodeURIComponent("%e3%80%82")]; b.nodeValue && a != b.nodeValue.length;) {
            for (var e = 0; e < d.length; e++)if (breakstr = d[e], 0 == b.nodeValue.substring(a -
                1).indexOf(breakstr))return a;
            a++
          }
          return a
        },
        returnClassArraySubstring: function (b) {
          var a = document.getElementsByTagName("*"), d = 0, e = [];
          for (i = 0; i < a.length; i++)a[i].className.replace(b, "") != a[i].className && (e[d] = a[i], d++);
          return e
        },
        splitString: function (b, a) {
          for (var d = [""], e = 0, c = 0; c < b.length; c++) {
            for (var h = 0; h < a.length; h++) {
              for (var k = a[h], l = !0, f = 0; f < k.length; f++)if (0 > b.length - (c + f) || k[k.length - f - 1] != b[c - f - 1]) {
                l = !1;
                break
              }
              l && (e++, d[e] = "")
            }
            d[e] += b[c]
          }
          return d
        },
        endsWithSpace: function (b) {
          return -1 !== b.indexOf(" ",
              b.length - 1)
        }
      }, postProcess: {
        cleanUpSpans: function () {
          rspkr.log("[ClientMarkup.postProcess.cleanUpSpans] called!");
          var b = document.getElementsByTagName(rspkr.Common.data.browser.syncContainer), a;
          for (i = b.length - 1; -1 < i; i--)a = document.createDocumentFragment(), a.textContent = b[i].textContent, b[i].parentNode.replaceChild(a, b[i])
        }, lightCleanUp: function () {
          rspkr.log("[ClientMarkup.postProcess.lightCleanUp] called!!");
          var b = document.getElementsByTagName(rspkr.Common.data.browser.syncContainer);
          for (i = b.length - 1; -1 <
          i; i--)b[i].className = b[i].className.replace("sync_sent_highlighted", "sync_sent"), b[i].className = b[i].className.replace("sync_word_highlighted", "sync_word"), -1 === b[i].className.toLowerCase().indexOf("sync_user") && b[i].removeAttribute("id")
        }, settingsCleanUp: function () {
          rspkr.log("[ClientMarkup.postProcess.settingsCleanUp] called!");
          var b = rspkr.HL.clientMarkup.previousWord.element, a = rspkr.HL.clientMarkup.previousWord.className, d = rspkr.HL.clientMarkup.previousSent.element, e = rspkr.HL.clientMarkup.previousSent.className;
          if (0 < b.length) {
            for (var c in b)b[c].className = a[c];
            rspkr.HL.clientMarkup.previousWord.element = [];
            rspkr.HL.clientMarkup.previousWord.className = []
          }
          if (0 < d.length) {
            for (c in d)d[c].className = e[c];
            rspkr.HL.clientMarkup.previousSent.element = [];
            rspkr.HL.clientMarkup.previousSent.className = []
          }
        }, fullCleanUp: function () {
          rspkr.log("[ClientMarkup.postProcess.fullCleanUp] called!");
          var b = rspkr.HL.clientMarkup.previousWord.element, a = rspkr.HL.clientMarkup.previousWord.className, d = rspkr.HL.clientMarkup.previousSent.element,
            e = rspkr.HL.clientMarkup.previousSent.className;
          if (0 < b.length) {
            for (var c in b)b[c].className = a[c];
            rspkr.HL.clientMarkup.previousWord.element = [];
            rspkr.HL.clientMarkup.previousWord.className = []
          }
          if (0 < d.length) {
            for (c in d)d[c].className = e[c];
            rspkr.HL.clientMarkup.previousSent.element = [];
            rspkr.HL.clientMarkup.previousSent.className = []
          }
          this.cleanUpSpans();
          rspkr.Common.data.selectedHTML = ""
        }
      }, sync: function (b, a) {
        var d = !1, e;
        0 == (b & 2) && (d = 0 != (b & 1) ? !0 : !1);
        1 == this.firstRun && (this.previousWord.element = [], this.previousWord.className =
          [], this.previousSent.element = [], this.previousSent.className = []);
        e = this.selectedWordsRange["sync" + a];
        if (e.className.replace("word", "") != e.className) {
          rspkr.log("inside");
          if (0 < this.previousWord.element.length && 0 < this.previousWord.className.length && !d) {
            for (d = 0; d < this.previousWord.element.length; d++)this.previousWord.element[d].className = this.previousWord.className[d];
            this.previousWord.element = [];
            this.previousWord.className = []
          }
          this.previousWord.element.push(e);
          this.previousWord.className.push(e.className);
          e.className = "sent" === rspkr.st.get("hl") ? "sync_user sync_sent_highlighted" : "sync_user sync_word_highlighted"
        }
        e && rspkr.HL.Scroll.execScroll(e);
        if (1 == this.firstRun) {
          this.firstRun = 0;
          if (0 < this.previousSent.element.length) {
            for (d = 0; d < this.previousSent.element.length; d++)this.previousSent.element[d].className = this.previousSent.className[d];
            this.previousSent.element = [];
            this.previousSent.className = []
          }
          if ("wordsent" == rspkr.st.get("hl")) {
            e = this.preProcess.returnClassArraySubstring("ffsent" + this.preProcess.numberOfSelections +
              " ");
            for (d = 0; d < e.length; d++)this.previousSent.element[d] = e[d], this.previousSent.className[d] = e[d].className, e[d].className = "ffsent" + this.preProcess.numberOfSelections + " sync_sent_highlighted"
          }
        }
      }, syncNew: function (b, a) {
        var d;
        1 == this.firstRun && (this.previousWord.element = [], this.previousWord.className = [], this.previousSent.element = [], this.previousSent.className = [], this.firstRun = 0);
        d = document.getElementById("sync" + a);
        if (d.className.replace("word", "") != d.className && ("word" === rspkr.st.get("hl") || "wordsent" ===
          rspkr.st.get("hl"))) {
          if (0 < this.previousWord.element.length && 0 < this.previousWord.className.length) {
            for (var e = 0; e < this.previousWord.element.length; e++)this.previousWord.element[e].className = this.previousWord.className[e];
            this.previousWord.element = [];
            this.previousWord.className = []
          }
          this.previousWord.element.push(d);
          this.previousWord.className.push(d.className);
          d.className = "sync_user sync_word_highlighted"
        } else if (d.className.replace("sent", "") != d.className && ("sent" === rspkr.st.get("hl") || "wordsent" ===
          rspkr.st.get("hl"))) {
          if (0 < this.previousSent.element.length && 0 < this.previousSent.className.length) {
            for (e = 0; e < this.previousSent.element.length; e++)this.previousSent.element[e].className = this.previousSent.className[e];
            this.previousSent.element = [];
            this.previousSent.className = []
          }
          this.previousSent.element.push(d);
          this.previousSent.className.push(d.className);
          d.className = "sync_user sync_sent_highlighted"
        }
        d && rspkr.HL.Scroll.execScroll(d)
      }
    }
  }
}();
