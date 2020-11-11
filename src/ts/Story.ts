class Story {
    /** The main input element */
    private input: JQuery<HTMLElement>;
    /** The current line index */
    private index: number;
    /** If input is currently locked */
    private locked: boolean;
    /** The history of previous lines */
    private history: string[];

    /**
     * Creates a new story
     * @param lines The lines of the story
     */
    public static create(lines: string[]) {
        new Story(lines);
    }

    private constructor(private lines: string[]) {
        // Get the main input element
        this.input = $("input")
            // Focus the input
            .trigger("focus")
            // Ensure the focus can't be lost
            .on("blur", (): any => this.input.trigger("focus"))
            // Check if a key should be processed
            .on("beforeinput", (event: any): void => {
                if (!this.preprocess(event)) {
                    event.preventDefault();
                }
            })
            // Process key clicks
            .on("keyup", (): void => this.process());
        
        this.index = 0;
        this.locked = false;
        this.history = [];

        // Set initial UI
        this.updatePlaceholder();
        this.updateLineCount();
    }

    /**
     * Processes a key input before appending it to the input element
     * @param event The key press event
     * @returns If the key should be processed
     */
    private preprocess(event: any): boolean {
        // Prevent processing when the input is locked
        if (this.locked) {
            return false;
        }
        // Get the current index of the line
        const index: number = this.input.val()?.toString().length ?? 0;

        // Check if the keys match
        return this.lines[this.index][index] === event.originalEvent.data;
    }

    /** Processes a key append event */
    private process(): void {
        // Check if the line and the input value are equal
        if (this.input.val() === this.lines[this.index].toString()) {
            // Add the current line to the history
            this.updateHistory();

            this.index++;
            this.locked = true;

            // Reduce the number of lines left
            this.updateLineCount();

            // Check if the story is complete
            if (this.index === this.lines.length) {
                this.input.off();
                return;
            }

            // Handle fading in/out of a new line
            this.lineComplete();
        }
    }

    /** Fades in a new line when a line has been completed */
    private lineComplete(): void {
        // Update the placeholder
        const placeholder: any = $(".placeholder").fadeOut(200, (): void => {
            this.updatePlaceholder();
            placeholder.fadeIn(200);
        });

        // Update the main input
        this.input.fadeOut(200, (): void => {
            this.input.val("");
            this.input.fadeIn(200);

            this.locked = false;
        });
    }

    /** Updates the history list */
    private updateHistory(): void {
        // Get the current line
        const line: string = this.lines[this.index];
        this.history.unshift(line);

        // Limit history to 15 entries
        if (this.history.length > 15) {
            this.history.pop();
        }

        // Append each history element, adding opacity to fade out older lines
        const parent: any = $(".history").empty();
        for (let index: number = 0; index < this.history.length; index++) {
            const element: any = $("<li>")
                .text(this.history[index])
                .css("opacity", 1 - (index / 15))
                .prependTo(parent);

            if (index == 0) {
                element.hide().fadeIn();
            }
        }
    }

    /** Sets the placeholder text */
    private updatePlaceholder(): void {
        $(".placeholder").text(this.lines[this.index]);
    }

    /** Sets the number of lines left in the story */
    private updateLineCount(): void {
        $(".line-count").text(this.lines.length - this.index);
    }
}