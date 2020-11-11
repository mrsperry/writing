class Main {
    /**
     * Creates a new story
     * @param id The ID of the story
     */
    public static createStory(id: string): void {
        // Get the story based on the ID
        $.get("src/data/" + id + ".story").then((data: any): void => {
            const lines: string[] = [];
            
            // Trim each line and replace duplicate spaces
            for (const line of data.split("\n")) {
                lines.push(line.trim().replaceAll(/(\s\s+)/g, " "));
            }

            Story.create(lines);
        });
    }
}