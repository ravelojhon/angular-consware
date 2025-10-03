import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { PostForm } from './post-form';
import { PostService } from '../../../core/services/post.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Post, CreatePost, UpdatePost } from '../../../core/models/post.model';

describe('PostFormComponent', () => {
  let component: PostForm;
  let fixture: ComponentFixture<PostForm>;
  let mockPostService: jasmine.SpyObj<PostService>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  const mockPost: Post = {
    id: 1,
    userId: 1,
    title: 'Test Post',
    body: 'Test body content'
  };

  const mockCreatePost: CreatePost = {
    userId: 1,
    title: 'New Post',
    body: 'New post body'
  };

  const mockUpdatePost: UpdatePost = {
    id: 1,
    title: 'Updated Post',
    body: 'Updated body'
  };

  beforeEach(async () => {
    const postServiceSpy = jasmine.createSpyObj('PostService', ['getPost', 'createPost', 'updatePost']);
    const notificationServiceSpy = jasmine.SpyObj('NotificationService', ['success', 'error']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      params: of({ id: 'new' })
    });
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [PostForm, ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        FormBuilder,
        { provide: PostService, useValue: postServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostForm);
    component = fixture.componentInstance;
    mockPostService = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
    mockNotificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockActivatedRoute = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
    mockSnackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize form and check edit mode', () => {
      spyOn(component, 'initializeForm');
      spyOn(component, 'checkEditMode');

      component.ngOnInit();

      expect(component.initializeForm).toHaveBeenCalled();
      expect(component.checkEditMode).toHaveBeenCalled();
    });
  });

  describe('initializeForm', () => {
    it('should create form with validators', () => {
      component.initializeForm();

      expect(component.postForm).toBeDefined();
      expect(component.postForm.get('title')?.hasError('required')).toBeTrue();
      expect(component.postForm.get('body')?.hasError('required')).toBeTrue();
      expect(component.postForm.get('userId')?.value).toBe(1);
    });
  });

  describe('checkEditMode', () => {
    it('should set edit mode to false for new post', () => {
      mockActivatedRoute.params = of({ id: 'new' });

      component.checkEditMode();

      expect(component.isEditMode).toBeFalse();
    });

    it('should set edit mode to true and load post for edit', () => {
      mockActivatedRoute.params = of({ id: '1' });
      spyOn(component, 'loadPostForEdit');

      component.checkEditMode();

      expect(component.isEditMode).toBeTrue();
      expect(component.postId).toBe(1);
      expect(component.loadPostForEdit).toHaveBeenCalled();
    });
  });

  describe('loadPostForEdit', () => {
    it('should load post and populate form', () => {
      component.postId = 1;
      mockPostService.getPost.and.returnValue(of(mockPost));
      spyOn(component, 'populateForm');

      component.loadPostForEdit();

      expect(mockPostService.getPost).toHaveBeenCalledWith(1);
      expect(component.currentPost).toEqual(mockPost);
      expect(component.populateForm).toHaveBeenCalledWith(mockPost);
    });

    it('should handle error when loading post', () => {
      component.postId = 1;
      const error = new Error('Post not found');
      mockPostService.getPost.and.returnValue(throwError(() => error));

      component.loadPostForEdit();

      expect(mockNotificationService.error).toHaveBeenCalledWith('Error al cargar el post: Post not found');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/posts']);
    });
  });

  describe('populateForm', () => {
    it('should populate form with post data', () => {
      component.initializeForm();
      component.populateForm(mockPost);

      expect(component.postForm.get('title')?.value).toBe(mockPost.title);
      expect(component.postForm.get('body')?.value).toBe(mockPost.body);
      expect(component.postForm.get('userId')?.value).toBe(mockPost.userId);
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      component.initializeForm();
    });

    it('should create post when form is valid and not in edit mode', () => {
      component.isEditMode = false;
      component.postForm.patchValue(mockCreatePost);
      spyOn(component, 'createPost');

      component.onSubmit();

      expect(component.createPost).toHaveBeenCalled();
    });

    it('should update post when form is valid and in edit mode', () => {
      component.isEditMode = true;
      component.postId = 1;
      component.postForm.patchValue(mockUpdatePost);
      spyOn(component, 'updatePost');

      component.onSubmit();

      expect(component.updatePost).toHaveBeenCalled();
    });

    it('should mark form as touched when invalid', () => {
      component.postForm.patchValue({ title: '', body: '' });
      spyOn(component, 'markFormGroupTouched');

      component.onSubmit();

      expect(component.markFormGroupTouched).toHaveBeenCalled();
    });
  });

  describe('createPost', () => {
    it('should create post and navigate to detail', () => {
      const createdPost = { ...mockCreatePost, id: 101 };
      component.postForm.patchValue(mockCreatePost);
      mockPostService.createPost.and.returnValue(of(createdPost));

      component.createPost();

      expect(mockPostService.createPost).toHaveBeenCalledWith(mockCreatePost);
      expect(mockNotificationService.success).toHaveBeenCalledWith('Post creado exitosamente');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/posts', createdPost.id]);
    });

    it('should handle error when creating post', () => {
      const error = new Error('Creation failed');
      component.postForm.patchValue(mockCreatePost);
      mockPostService.createPost.and.returnValue(throwError(() => error));

      component.createPost();

      expect(mockNotificationService.error).toHaveBeenCalledWith('Error al crear el post: Creation failed');
    });
  });

  describe('updatePost', () => {
    it('should update post and navigate to detail', () => {
      component.postId = 1;
      component.postForm.patchValue(mockUpdatePost);
      const updatedPost = { ...mockUpdatePost, userId: 1 };
      mockPostService.updatePost.and.returnValue(of(updatedPost));

      component.updatePost();

      expect(mockPostService.updatePost).toHaveBeenCalledWith({ id: 1, ...mockUpdatePost });
      expect(mockNotificationService.success).toHaveBeenCalledWith('Post actualizado exitosamente');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/posts', updatedPost.id]);
    });

    it('should handle error when updating post', () => {
      const error = new Error('Update failed');
      component.postId = 1;
      component.postForm.patchValue(mockUpdatePost);
      mockPostService.updatePost.and.returnValue(throwError(() => error));

      component.updatePost();

      expect(mockNotificationService.error).toHaveBeenCalledWith('Error al actualizar el post: Update failed');
    });
  });

  describe('form validation', () => {
    beforeEach(() => {
      component.initializeForm();
    });

    it('should validate required fields', () => {
      expect(component.postForm.get('title')?.hasError('required')).toBeTrue();
      expect(component.postForm.get('body')?.hasError('required')).toBeTrue();
      expect(component.postForm.get('userId')?.hasError('required')).toBeTrue();
    });

    it('should validate minLength for title', () => {
      component.postForm.patchValue({ title: 'ab' });
      expect(component.postForm.get('title')?.hasError('minlength')).toBeTrue();

      component.postForm.patchValue({ title: 'abc' });
      expect(component.postForm.get('title')?.hasError('minlength')).toBeFalse();
    });

    it('should validate minLength for body', () => {
      component.postForm.patchValue({ body: 'short' });
      expect(component.postForm.get('body')?.hasError('minlength')).toBeTrue();

      component.postForm.patchValue({ body: 'This is a longer body content' });
      expect(component.postForm.get('body')?.hasError('minlength')).toBeFalse();
    });

    it('should validate min value for userId', () => {
      component.postForm.patchValue({ userId: 0 });
      expect(component.postForm.get('userId')?.hasError('min')).toBeTrue();

      component.postForm.patchValue({ userId: 1 });
      expect(component.postForm.get('userId')?.hasError('min')).toBeFalse();
    });
  });

  describe('utility methods', () => {
    beforeEach(() => {
      component.initializeForm();
    });

    it('should get form control', () => {
      const control = component.getFormControl('title');
      expect(control).toBe(component.postForm.get('title'));
    });

    it('should check for errors', () => {
      component.postForm.patchValue({ title: '' });
      expect(component.hasError('title', 'required')).toBeTrue();
      expect(component.hasError('title', 'minlength')).toBeFalse();
    });

    it('should get error message', () => {
      component.postForm.patchValue({ title: '' });
      const message = component.getErrorMessage('title');
      expect(message).toContain('Título');
    });

    it('should mark form group as touched', () => {
      spyOn(component.postForm, 'markAllAsTouched');
      component.markFormGroupTouched();
      expect(component.postForm.markAllAsTouched).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete destroy subject', () => {
      spyOn(component['destroy$'], 'next');
      spyOn(component['destroy$'], 'complete');

      component.ngOnDestroy();

      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();
    });
  });
});
