const db_post = require('./models/Post');

const userId = '214284e2-05e8-4c66-a96c-b7451899df47';

const movieId = 'bb03fc56-eaaa-4ffe-880d-46488d178420';

const content = `Sint in ea ullamco proident ipsum deserunt. Anim laborum occaecat fugiat veniam in ea ipsum in est nisi. Nulla aute sint cupidatat est enim sint dolore veniam ex irure. Cupidatat Lorem proident cillum pariatur esse qui non consectetur dolore amet quis. Proident consectetur deserunt deserunt ea non reprehenderit pariatur incididunt sit tempor eu. Ex pariatur quis laboris exercitation commodo. Minim excepteur officia officia labore incididunt sint aliquip nostrud culpa fugiat do officia minim consectetur.

Ut sunt fugiat laborum esse sint aute esse do irure nisi laborum culpa dolor duis. Laborum non ea ex dolor. In ea duis in proident. Tempor consectetur ad irure nisi do quis cillum irure incididunt. Excepteur pariatur laborum consequat dolor ea do proident velit. Sit irure consectetur proident do.

Laboris minim incididunt non anim ut labore ipsum voluptate elit reprehenderit ea. Aliquip magna aliqua qui nostrud sint culpa. Pariatur consequat ad in sint ad pariatur esse culpa officia sint.

Exercitation commodo cillum laborum fugiat eu. Tempor laborum sunt cillum deserunt sit. Nulla enim aliquip nostrud ipsum sit. Irure laborum ut et excepteur elit irure Lorem eu ullamco laboris ipsum. Incididunt cillum laboris duis aliqua sit minim. Veniam incididunt consequat in enim ea. Id ex incididunt voluptate eiusmod do commodo eu ipsum labore occaecat amet cupidatat eiusmod.`;

const images = [
    {
        image_url:
            'https://image.tmdb.org/t/p/w500/re9VGdZlwTrzo9G5mQ0Ywtus6uU.jpg',
        caption: 'Image 1 caption',
    },
    {
        image_url:
            'https://image.tmdb.org/t/p/w1280/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg',
        caption: '',
    },
    {
        image_url:
            'https://image.tmdb.org/t/p/w500/Ac68G8LkY4AJL6lXpClRP4uJMRV.jpg',
        caption: 'Image 3 caption',
    },
];

// db_post.createNewPost(userId, movieId, content, images);

// db_post.fetchSinglePostById('0171becc-b71b-4cf5-b895-8c1b76d0d1e1', 2);

// db_post.isJoinedForumByPostId(
//     'b3ec6a9d-4f3e-4054-b42b-5d54575b2657',
//     '0171becc-b71b-4cf5-b895-8c1b76d0d1e1'
// );
db_post.isJoinedForumByPostId(
    '6a5fc3ee-6d9d-42fc-87af-9ed52d7d774d',
    '0171becc-b71b-4cf5-b895-8c1b76d0d1e1'
);

/*
login body:
POST
/auth/login
{
  "username": "pqr",
  "password": "hellobye123"
}

create new post body:
POST
/movie/bb03fc56-eaaa-4ffe-880d-46488d178420/forum/submit
{
    "content": "Quis irure commodo ut dolor et est anim consectetur et nisi elit proident aute. Nulla reprehenderit commodo aute sit. Ut pariatur consectetur consequat incididunt cupidatat dolor consequat ea enim. Minim ad exercitation irure esse qui cupidatat ullamco pariatur velit. Exercitation aliquip occaecat ad Lorem non fugiat minim voluptate. Nostrud irure pariatur excepteur anim anim qui labore proident pariatur. Culpa cupidatat elit et in cillum.\n\nSit eu exercitation exercitation aute Lorem quis excepteur elit aliquip. Laboris et ut commodo enim mollit cupidatat ex ipsum enim anim ad velit. Sint ea quis et reprehenderit dolore. Amet non eiusmod est excepteur proident magna consequat incididunt deserunt aliquip. Fugiat occaecat veniam sit reprehenderit aliquip exercitation aliquip laboris sint consectetur sunt ullamco nisi.\n\nUt elit sint duis amet magna labore nostrud. Quis duis quis do aliqua. Veniam occaecat dolor ullamco aute. Laborum fugiat ipsum ut sint velit ex dolor velit aliquip laboris id. Velit culpa nulla et et exercitation cillum. Fugiat velit deserunt consectetur sint non nisi ut irure nisi deserunt nostrud dolore Lorem.",
    "images": [
        {
            "image_url": "https://image.tmdb.org/t/p/w500/re9VGdZlwTrzo9G5mQ0Ywtus6uU.jpg",
            "caption": "Image 1 caption"
        },
        {
            "image_url": "https://image.tmdb.org/t/p/w1280/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg"
        },
        {
            "image_url": "https://image.tmdb.org/t/p/w500/Ac68G8LkY4AJL6lXpClRP4uJMRV.jpg",
            "caption": "Image 3 caption"
        }
    ]
}

*/
