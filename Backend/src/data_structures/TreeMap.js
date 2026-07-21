// A simple Binary Search Tree functioning as a TreeMap to sort videos by views
class TreeNode {
    constructor(key, value) {
        this.key = key; // View count
        this.value = value; // Video Data
        this.left = null;
        this.right = null;
    }
}

class TreeMap {
    constructor() {
        this.root = null;
    }

    insert(key, value) {
        const newNode = new TreeNode(key, value);
        if (!this.root) {
            this.root = newNode;
            return;
        }
        let current = this.root;
        while (true) {
            if (key < current.key) {
                if (!current.left) { current.left = newNode; return; }
                current = current.left;
            } else {
                if (!current.right) { current.right = newNode; return; }
                current = current.right;
            }
        }
    }

    // Reverse in-order traversal to get highest views first
    getDescendingOrder(node = this.root, result = []) {
        if (node) {
            this.getDescendingOrder(node.right, result);
            result.push(node.value);
            this.getDescendingOrder(node.left, result);
        }
        return result;
    }
}

module.exports = TreeMap;