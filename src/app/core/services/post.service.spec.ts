import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PostService } from './post.service';
import { Post, CreatePost, UpdatePost } from '../models/post.model';

describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;
  const baseUrl = 'https://jsonplaceholder.typicode.com/posts';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PostService],
    });
    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPosts', () => {
    it('should return an array of posts', () => {
      const mockPosts: Post[] = [
        { id: 1, userId: 1, title: 'Test Post 1', body: 'Test body 1' },
        { id: 2, userId: 2, title: 'Test Post 2', body: 'Test body 2' },
      ];

      service.getPosts().subscribe((posts) => {
        expect(posts).toEqual(mockPosts);
        expect(posts.length).toBe(2);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockPosts);
    });

    it('should handle HTTP errors', () => {
      const errorMessage = 'Server error';

      service.getPosts().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe(errorMessage);
        },
      });

      const req = httpMock.expectOne(baseUrl);
      req.flush(errorMessage, { status: 500, statusText: errorMessage });
    });
  });

  describe('getPost', () => {
    it('should return a single post by id', () => {
      const mockPost: Post = { id: 1, userId: 1, title: 'Test Post', body: 'Test body' };
      const postId = 1;

      service.getPost(postId).subscribe((post) => {
        expect(post).toEqual(mockPost);
        expect(post.id).toBe(postId);
      });

      const req = httpMock.expectOne(`${baseUrl}/${postId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPost);
    });

    it('should handle 404 error for non-existent post', () => {
      const postId = 999;

      service.getPost(postId).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne(`${baseUrl}/${postId}`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('createPost', () => {
    it('should create a new post', () => {
      const newPost: CreatePost = {
        userId: 1,
        title: 'New Post',
        body: 'New post body',
      };
      const createdPost: Post = { id: 101, ...newPost };

      service.createPost(newPost).subscribe((post) => {
        expect(post).toEqual(createdPost);
        expect(post.id).toBe(101);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newPost);
      req.flush(createdPost);
    });

    it('should handle creation errors', () => {
      const newPost: CreatePost = {
        userId: 1,
        title: 'New Post',
        body: 'New post body',
      };

      service.createPost(newPost).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
        },
      });

      const req = httpMock.expectOne(baseUrl);
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('updatePost', () => {
    it('should update an existing post', () => {
      const updateData: UpdatePost = {
        id: 1,
        title: 'Updated Post',
        body: 'Updated body',
      };
      const updatedPost: Post = {
        id: 1,
        userId: 1,
        title: updateData.title || 'Updated Post',
        body: updateData.body || 'Updated body',
      };

      service.updatePost(updateData).subscribe((post) => {
        expect(post).toEqual(updatedPost);
        expect(post.title).toBe('Updated Post');
      });

      const req = httpMock.expectOne(`${baseUrl}/${updateData.id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush(updatedPost);
    });

    it('should handle update errors', () => {
      const updateData: UpdatePost = {
        id: 1,
        title: 'Updated Post',
      };

      service.updatePost(updateData).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
        },
      });

      const req = httpMock.expectOne(`${baseUrl}/${updateData.id}`);
      req.flush('Internal Server Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('patchPost', () => {
    it('should partially update a post', () => {
      const postId = 1;
      const patchData = { title: 'Patched Title' };
      const patchedPost: Post = { id: 1, userId: 1, title: 'Patched Title', body: 'Original body' };

      service.patchPost(postId, patchData).subscribe((post) => {
        expect(post).toEqual(patchedPost);
        expect(post.title).toBe('Patched Title');
      });

      const req = httpMock.expectOne(`${baseUrl}/${postId}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(patchData);
      req.flush(patchedPost);
    });
  });

  describe('deletePost', () => {
    it('should delete a post', () => {
      const postId = 1;

      service.deletePost(postId).subscribe((response) => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne(`${baseUrl}/${postId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle delete errors', () => {
      const postId = 1;

      service.deletePost(postId).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne(`${baseUrl}/${postId}`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });
});
