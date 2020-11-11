"use strict";
class Main {
    static createStory(id) {
        $.get("src/data/" + id + ".story").then((data) => {
            const lines = [];
            for (const line of data.split("\n")) {
                lines.push(line.trim().replaceAll(/(\s\s+)/g, " "));
            }
            Story.create(lines);
        });
    }
}
class Story {
    constructor(lines) {
        this.lines = lines;
        this.parent = $("input")
            .on("beforeinput", (event) => {
            if (!this.preprocess(event)) {
                event.preventDefault();
            }
        })
            .on("keyup", () => this.process());
        this.index = 0;
        this.locked = false;
        this.history = [];
        this.updatePlaceholder();
        this.updateLineCount();
    }
    static create(lines) {
        new Story(lines);
    }
    preprocess(event) {
        const index = this.parent.val()?.toString().length ?? 0;
        return this.lines[this.index][index] === event.originalEvent.data;
    }
    process() {
        if (this.locked) {
            this.parent.val("");
        }
        if (this.parent.val() === this.lines[this.index].toString()) {
            this.updateHistory();
            this.index++;
            this.updateLineCount();
            this.locked = true;
            if (this.index === this.lines.length) {
                this.parent.off();
                return;
            }
            this.lineComplete();
        }
    }
    updateHistory() {
        const line = this.lines[this.index];
        this.history.unshift(line);
        if (this.history.length > 15) {
            this.history.pop();
        }
        const parent = $(".history").empty();
        for (let index = 0; index < this.history.length; index++) {
            const element = $("<li>")
                .text(this.history[index])
                .css("opacity", 1 - (index / 15))
                .prependTo(parent);
            if (index == 0) {
                element.hide().fadeIn();
            }
        }
    }
    lineComplete() {
        const placeholder = $(".placeholder").fadeOut(200, () => {
            this.updatePlaceholder();
            placeholder.fadeIn(200);
        });
        this.parent.fadeOut(200, () => {
            this.parent.val("");
            this.parent.fadeIn(200);
            this.locked = false;
        });
    }
    updatePlaceholder() {
        $(".placeholder").text(this.lines[this.index]);
    }
    updateLineCount() {
        $(".line-count").text(this.lines.length - this.index);
    }
}
