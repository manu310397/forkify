export default class Likes {
    constructor() {
        this.likes = []
    }

    addLike(id, title, author, img) {
        const like = {id, title, author, img};
        this.likes.push(like);

        this.persistData();
        
        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);

        this.persistData();
    }

    isLiked(id){
        return this.likes.findIndex(el => el.id === id) != -1;
    }

    getTotalLikes() {
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    retrieveData() {
        const likes = JSON.parse(localStorage.getItem('likes'));
        if(likes) this.likes = likes;
    }
}