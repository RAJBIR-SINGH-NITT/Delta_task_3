// LinkedList used to manage the video playlist/queue
class Node {
    constructor(video) {
        this.video = video;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
    }

    addVideo(video) {
        const newNode = new Node(video);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail.next = newNode;
            this.tail = newNode;
        }
    }

    getAll() {
        let current = this.head;
        const videos = [];
        while (current) {
            videos.push(current.video);
            current = current.next;
        }
        return videos;
    }
}

module.exports = LinkedList;``