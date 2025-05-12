<template>
    <div class="col-lg-6 col-md-8 no-pd">
        <div class="main-ws-sec">
            <div class="post-topbar">
                <textarea v-model="posts" name="post_area" id="post_area" class="form-control">何を考えていますか?</textarea>
                <div class="chose-image">
                    <ul>
                        <li>
                            <label for="btn_chose_file" class="btn btn-danger" title="Chose file .png or .jpeg">画像を選択</label>
                            <input @change="chooseImage" accept=".jpg, .jpeg" type="file" class="btn btn-danger" name="chose-file" id="btn_chose_file">
                        </li>
                    </ul>
                </div>
                <div class="post-st">
                    <ul>
                        <li><a class="active" v-on:click="submit()" href="#" title="Submit post data">送信</a></li>
                    </ul>
                </div>
                <!--post-st end-->
            </div>
            <!--post-topbar end-->
            <div class="posts-section">
                <!--post-bar end-->
                <div v-for="post in timelinePost" class="posty">
                    <div class="post-bar no-margin">
                        <div class="post_topbar">
                            <div class="usy-dt">
                                <img width="52px" v-if="post.author._avatar != null" :src="post.author._avatar" :alt="post.author.name" :title="post.author.name" />
                                <img width="52px" v-else src="../assets/images/resources/us-pc2.png" alt="">
                                <div class="usy-name">
                                    <h3>{{ post.author.name }}</h3>
                                    <span><img src="../assets/images/clock.png" alt="">{{ post.since_created }}</span>
                                </div>
                            </div>
                            <div class="ed-opts">
                                <!-- Not my own post here none -->
                            </div>
                        </div>
                        <div class="epi-sec">
                            <ul class="descp">
                                <li><img src="../assets/images/icon8.png" alt=""><span>{{ post.experiences }}</span></li>
                                <li><img src="../assets/images/icon9.png" alt="">
                                    <span v-if="post.author.location">{{ post.author.location }}</span>
                                    <span v-else>VietNam</span>
                                </li>
                            </ul>
                            <ul class="bk-links">
                                <li>
                                    <p v-if="post.favorites.length > 0" title="" v-on:click="unBookmark(post.id)"><i class="fa fa-bookmark"></i></p>
                                    <p v-else title="" v-on:click="bookmark(post.id)"><i style="background-color: gray;" class="fa fa-bookmark"></i></p>
                                </li>
                            </ul>
                        </div>
                        <div class="job_descp">
                            <div class="content" v-if="post.short_content && showReadMore.indexOf(post.id) == -1">
                                {{ post.short_content }}
                                <span>。。。</span>
                                <span class="text-danger txt-readmore" v-on:click="readMore(post.id)">もっとみる</span>
                            </div>
                            <div class="content" v-else>
                                {{ post.content }}
                            </div>
                            <br>
                            <ul class="skill-tags" v-if="post.skills.length > 0">
                                <li v-for="skill in post.skills">
                                    <a href="#" title="">{{ skill.skill }}</a>
                                </li>
                            </ul>
                        </div>
                        <div class="job-status-bar">
                            <ul class="like-com">
                                <li>
                                    <a v-if="post.is_like == 0" v-on:click="like(post.id, 'like')" class="color-b2b2b2 cusror-poiter hover-color"><i class="fa fa-heart"></i> いいね ({{ post.total_like }})</a>
                                    <a v-else v-on:click="like(post.id, 'unlike')" class="text-danger    cusror-poiter hover-color"><i class="fa fa-heart"></i> いいね ({{ post.total_like }})</a>
                                </li>
                                <li>
                                    <a v-on:click="showComment(post.id)" class="color-b2b2b2 cusror-poiter hover-color"><i class="fa fa-comment-alt"></i> コメント ({{ post.total_comment }})</a>
                                </li>
                            </ul>
                            <a href="#"><i class="fa fa-eye"></i>閲覧数 ({{ post.view_count }})</a>
                        </div>
                    </div>
                    <!--post-bar end-->
                    <div v-if="post.id == selectedPostShowComment" class="comment-section">
                        <div class="comment-sec">
                            <ul v-if="list_comment.length > 0">
                                <li v-for="comment in list_comment">
                                    <div class="comment-list">
                                        <div class="bg-img">
                                            <img v-if="comment.avatar" class="ava-cmt" :src="comment._avatar" :alt="comment.name">
                                            <img v-else class="ava-cmt" src="http://localhost/wise_social_api/public/avatars/nguyenlongit95/user-pro-img.png">
                                        </div>
                                        <div class="comment">
                                            <h3>{{ comment.name }}</h3>
                                            <span><img src="../assets/images/clock.png" alt=""> {{ comment._created_at }}</span>
                                            <p>{{ comment.comment }}</p>
                                            <p v-on:click="clickReply(comment.id, comment.name)" href="#" title="" class="active text-danger"><i class="fa fa-reply-all"></i>返信</p>
                                        </div>
                                    </div>
                                    <!--comment-list end-->
                                    <!-- Reply begin -->
                                    <ul v-if="comment.child.length > 0">
                                        <li v-for="subComment in comment.child">
                                            <div class="comment-list">
                                                <div class="bg-img">
                                                    <img width="38px" v-if="subComment.author._avatar" :src="subComment.author._avatar" :alt="subComment.author.name">
                                                    <img width="38px" v-else src="../assets/images/resources/bg-img2.png">
                                                </div>
                                                <div class="comment">
                                                    <h3>{{ subComment.author.name }}</h3>
                                                    <span><img src="../assets/images/clock.png" alt="">{{ subComment._created_at }}</span>
                                                    <p>{{ subComment.comment }} </p>
                                                </div>
                                            </div>
                                            <!--comment-list end-->
                                        </li>
                                    </ul>
                                    <!-- End reply -->
                                </li>
                            </ul>
                        </div>
                        <!--comment-sec end-->
                        <div class="post-comment">
                            <div class="comment_box">
                                <form action="#" >
                                    <label v-if="replyingTo" class="text-danger" for="comment_form">{{ this.replyingTo }}</label>
                                    <input type="text" id="comment_form" placeholder="コメント #タグ を入力" v-model="comment">
                                    <button v-on:click.prevent="sendComment()"><i class="fa fa-paper-plane"></i></button>
                                </form>
                            </div>
                        </div>
                        <!--post-comment end-->
                    </div>
                    <!--comment-section end-->
                </div>
                <!--posty end-->
                <div class="process-comm">
                    <div class="spinner">
                        <div class="bounce1"></div>
                        <div class="bounce2"></div>
                        <div class="bounce3"></div>
                    </div>
                </div>
                <!--process-comm end-->
            </div>
            <!--posts-section end-->
        </div>
        <!--main-ws-sec end-->
    </div>
</template>

<script>
    // import Vue from 'vue'
    import axios from 'axios'
    // import component1 from 'component1'
    // import component2 from 'component2'

    export default {
        /***********************************************************************************************************
         ******************************* Pass data to child component **********************************************
         **********************************************************************************************************/
        // prop: [variable1, variable2],
        // components: {component1, component2},
        /**
         * Define global service socket
         *
         * Listing event from socket.io server
         * "ServerSendCommentToClient" is the name of the channel that sends notifications to all clients installed in the server socket
         */
        sockets: {
            // Send data to server
            ClientSendCommentToServer: function (responseComment) {
                this.comment = responseComment;  //lấy dữ liệu bên api trả về trong hàm postComment
            },
            // Listen event from server and render data
            ServerSendCommentToClient: function (responseComment) {
                // Push to the comment list
                if (responseComment.type === 'comment' && this.transaction.id == responseComment.transaction_id) {
                    this.pushCommentToList(responseComment);
                    this.$forceUpdate();
                }
            },
        },
        data() {
            /***********************************************************************************************************
             ******************************* Initialize global variables ***********************************************
             **********************************************************************************************************/
            return {
                msg: 'Hello world!',
                users: [],
                posts: "",
                postImage: null,
                token: sessionStorage.getItem("token"),
                offset: 0,
                limit: 6,
                timelinePost: [],
                showReadMore : [],
                selectedPostShowComment: null,
                commentOffset: 0,
                comment: '',
                parent: 0,
                list_comment: [],
                replyingTo: null,
            }
        },
        created() {
            /***********************************************************************************************************
             *********************** Initialize data when this component is used. **************************************
             **********************************************************************************************************/
            console.log('Init created component and call to function get data from api server.');
            this.timeLine();
        },
        mounted() {
            /***********************************************************************************************************
             ******************** Once created, the interface is displayed and calls mounted. **************************
             **********************************************************************************************************/
        },
        watch: {
            /***********************************************************************************************************
             ********************************* Methods change value for a variable *************************************
             **********************************************************************************************************/
            msg() {
                console.log("When the value of the msg variable changes, this method will be executed.");
            }
        },
        computed: {
            appendMsg() {
                return msg + "Process the value and assign the value to the corresponding variable the var has changed.";
            }
        },
        methods: {
            /***********************************************************************************************************
             ******************************* Default functions that handle local data **********************************
             **********************************************************************************************************/

            /**
             * Example default function not using param
             */
            defaultFunction() {
                this.msg = "Replace message here!";
            },

            chooseImage(event) {
                let file = event.target.files[0];
                if (file.type != 'image/jpeg' && file.type != 'image/jpg') {
                    alert('ファイル形式は「jpeg」または「jpg」を選択してください。')
                    return null;
                }
                if (file.size > 2048000) {
                    alert('最大ファイル「2mb」');
                    return null;
                }
                this.postImage = file;
            },

            async submit() {
                if (this.posts == '' || this.posts == null) {
                    alert('内容を入力してください。');
                    return null;
                }
                let formData = new FormData();
                formData.append('content', this.posts);
                formData.append('image', this.postImage);
                
                // Send to server
                try {
                    const callAPI = await axios.post('http://localhost/wise_social_api/public/api/create-post',
                        formData
                    ,{
                        /************ Attach param for request here ***************/
                        headers: {
                            "Content-type" : "multipart/form-data",
                            "Authorization": "Bearer " + this.token
                        }
                    });
                    if (callAPI.data.code == 200) {
                        // TODO: recall load all posts
                        this.posts = '',
                        this.postImage = null;
                        return null;
                    } else {
                        alert("Call api falled. please check again!");
                    }
                } catch (err) {
                    console.log(err);
                }
            },

            /**
             * Example default function using param 
             *
             * @param int pageNum number of page
             * @return boolean
             */
            defaultFunctionUsingParam(pageNum) {
                console.log(pageNum);
                return false;
            },

            readMore(postId) {
                this.showReadMore.push(postId);
            },

            /***********************************************************************************************************
             ******* Async and await functions for manipulating server-side data through internal API protocols ********
             **********************************************************************************************************/
            async timeLine() {
                try {
                    const callAPI = await axios.get('http://localhost/wise_social_api/public/api/timeline', {
                        /************ Attach param for request here ***************/
                        headers: {
                            "Content-type" : "application/json",
                            "Authorization": "Bearer " + this.token
                        },
                        params: {
                            offset: this.offset,
                            limit: this.limit
                        }
                    });
                    if (callAPI.data.code == 200) {
                        console.log(callAPI.data.data);
                        this.timelinePost = callAPI.data.data;
                    } else {
                        alert("Call api falled. please check again!");
                    }
                } catch (err) {
                    console.log(err);
                }
            },

            async bookmark(postId) {
                try {
                    const callAPI = await axios.get('http://localhost/wise_social_api/public/api/add-favorites', {
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": "Bearer " + this.token
                    },
                    params: { post_id: postId }
                    });

                    if (callAPI.data.code === 200) {
                        const index = this.timelinePost.findIndex(post => post.id === postId);
                    if (index !== -1) {
                        this.timelinePost[index].favorites.push({ post_id: postId });
                    }
                    } else {
                        alert("Call API failed. Please check again!");
                    }
                } catch (err) {
                    console.log(err);
                }
            },

            async unBookmark(postId) {
                try {
                    const callAPI = await axios.get('http://localhost/wise_social_api/public/api/remove-favorites', {
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": "Bearer " + this.token
                    },
                    params: { post_id: postId }
                    });

                    if (callAPI.data.code === 200) {
                        const index = this.timelinePost.findIndex(post => post.id === postId);
                    if (index !== -1) {
                        this.timelinePost[index].favorites = [];
                    }
                    } else {
                        alert("Call API failed. Please check again!");
                    }
                } catch (err) {
                    console.log(err);
                }
            },

            async like(postId, action) {
                try {
                    const callAPI = await axios.get('http://localhost/wise_social_api/public/api/like', {
                        /************ Attach param for request here ***************/
                        headers: {
                            "Content-type" : "application/json",
                            "Authorization": "Bearer " + this.token 
                        },
                        params: {
                            post_id: postId,
                            action: action
                        }
                    });
                    if (callAPI.data.code === 200) {
                        const index = this.timelinePost.findIndex(post => post.id === postId);
                        if (index !== -1) {
                            this.timelinePost[index].favorites = [];
                            if (this.timelinePost[index].id == postId && action == 'like') {
                                this.timelinePost[index].is_like = 1;
                                this.timelinePost[index].total_like++;
                            }
                            if (this.timelinePost[index].id == postId && action == 'unlike') {
                                this.timelinePost[index].is_like = 0;
                                this.timelinePost[index].total_like--;
                            }
                        }
                    } else {
                        alert("Call API failed. Please check again!");
                    }
                } catch (err) {
                    console.log(err);
                }
            },

            async showComment (postId) {
                this.selectedPostShowComment = postId;
                const callAPI = await axios.get('http://localhost/wise_social_api/public/api/list-comment', {
                    /************ Attach param for request here ***************/
                    headers: {
                        "Content-type" : "application/json",
                        "Authorization": "Bearer " + this.token 
                    },
                    params: {
                        post_id: postId,
                        offset: this.commentOffset,
                        limit: 6
                    }
                });
                this.list_comment = callAPI.data.data;
                this.parent = 0;
                this.replyingTo = null;
            },

            async sendComment() {
                let formData = new FormData();
                formData.append('post_id', this.selectedPostShowComment);
                formData.append('comment', this.comment);
                formData.append('parent', this.parent);
                // Send to server
                const callAPI = await axios.post('http://localhost/wise_social_api/public/api/comment', 
                    formData
                ,{
                    /************ Attach param for request here ***************/
                    headers: {
                        "Content-type" : "multipart/form-data",
                        "Authorization": "Bearer " + this.token 
                    }
                });
                console.log(callAPI);
                this.comment = '';
            },
            clickReply(parentId, name) {
                this.parent = parentId;
                this.replyingTo = name;
            }
            //TODO: send comment to socket
        },
    }
</script>

<style>
/**
* Custom local style css
*/
.txt-readmore:hover {
    cursor: pointer;
}
.posty {
    margin-bottom: 20px;
}
</style>