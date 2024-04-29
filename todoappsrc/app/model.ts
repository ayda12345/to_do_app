export class Model {
    user;
    items;
    constructor() {
        this.user = "X";
        this.items = [
            new ToDoItem("Spor", true),
            new ToDoItem("Kahvaltı", false),
            new ToDoItem("Sinema", false),
            new ToDoItem("Ders Çalışma", false),


        ];
    }
}
export class ToDoItem {
    description;
    action;
    constructor(description:any, action:any) {
        this.description = description;
        this.action = action;

    }
}