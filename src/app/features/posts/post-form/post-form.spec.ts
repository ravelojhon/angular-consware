import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PostForm } from './post-form';
import { PostService } from '../../../core/services/post.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Post, CreatePost, UpdatePost } from '../../../core/models/post.model';

describe('PostForm', () => {
  let component: PostForm;
  let fixture: ComponentFixture<PostForm>;
  let mockPostService: jasmine.SpyObj<PostService>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;

  const mockPost: Post = {
    id: 1,
    userId: 1,
    title: 'Test Post',
    body: 'Test body content',
  };

  const mockCreatePost: CreatePost = {
    userId: 1,
    title: 'New Post',
    body: 'New body content',
  };

  const mockUpdatePost: UpdatePost = {
    id: 1,
    title: 'Updated Post',
    body: 'Updated body',
  };

  beforeEach(async () => {
    const postServiceSpy = jasmine.createSpyObj('PostService', [
      'getPost',
      'createPost',
      'updatePost',
    ]);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'success',
      'error',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      params: of({ id: 'new' }),
    });
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [PostForm, ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        { provide: PostService, useValue: postServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostForm);
    component = fixture.componentInstance;
    mockPostService = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
    mockNotificationService = TestBed.inject(
      NotificationService
    ) as jasmine.SpyObj<NotificationService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockActivatedRoute = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize form with default values', () => {
      component.ngOnInit();

      expect(component.postForm).toBeDefined();
      expect(component.postForm.get('title')?.value).toBe('');
      expect(component.postForm.get('body')?.value).toBe('');
      expect(component.postForm.get('userId')?.value).toBe(1);
    });

    it('should set edit mode when id is provided', () => {
      mockActivatedRoute.params = of({ id: '1' });
      mockPostService.getPost.and.returnValue(of(mockPost));

      component.ngOnInit();

      expect(component.isEditMode).toBeTrue();
      expect(component.postId).toBe(1);
    });
  });

  describe('form validation', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should have required validators', () => {
      expect(component.postForm.get('title')?.hasError('required')).toBeTrue();
      expect(component.postForm.get('body')?.hasError('required')).toBeTrue();
    });

    it('should validate minimum length for title', () => {
      component.postForm.patchValue({ title: 'Short' });
      expect(component.postForm.get('title')?.hasError('minlength')).toBeTrue();
    });

    it('should validate minimum length for body', () => {
      component.postForm.patchValue({ body: 'Short' });
      expect(component.postForm.get('body')?.hasError('minlength')).toBeTrue();
    });

    it('should be valid with proper values', () => {
      component.postForm.patchValue({
        title: 'This is a valid title with enough characters',
        body: 'This is a valid body with enough characters to pass validation',
      });
      expect(component.postForm.valid).toBeTrue();
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should call createPost when form is valid and not in edit mode', () => {
      component.isEditMode = false;
      component.postForm.patchValue(mockCreatePost);
      mockPostService.createPost.and.returnValue(of(mockPost));

      component.onSubmit();

      expect(mockPostService.createPost).toHaveBeenCalledWith(mockCreatePost);
    });

    it('should call updatePost when form is valid and in edit mode', () => {
      component.isEditMode = true;
      component.postId = 1;
      component.postForm.patchValue(mockUpdatePost);
      mockPostService.updatePost.and.returnValue(of(mockPost));

      component.onSubmit();

      expect(mockPostService.updatePost).toHaveBeenCalledWith({ ...mockUpdatePost });
    });

    it('should mark form as touched when invalid', () => {
      component.postForm.patchValue({ title: '' });

      component.onSubmit();

      expect(component.postForm.get('title')?.touched).toBeTrue();
    });
  });

  describe('form submission', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should handle successful post creation', () => {
      component.isEditMode = false;
      component.postForm.patchValue(mockCreatePost);
      mockPostService.createPost.and.returnValue(of(mockPost));

      component.onSubmit();

      expect(mockNotificationService.success).toHaveBeenCalledWith('Post creado exitosamente');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/posts']);
    });

    it('should handle successful post update', () => {
      component.isEditMode = true;
      component.postId = 1;
      component.postForm.patchValue(mockUpdatePost);
      mockPostService.updatePost.and.returnValue(of(mockPost));

      component.onSubmit();

      expect(mockNotificationService.success).toHaveBeenCalledWith('Post actualizado exitosamente');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/posts']);
    });

    it('should handle post creation error', () => {
      component.isEditMode = false;
      component.postForm.patchValue(mockCreatePost);
      mockPostService.createPost.and.returnValue(of(mockPost));

      component.onSubmit();

      expect(mockNotificationService.success).toHaveBeenCalled();
    });
  });

  describe('form state', () => {
    it('should have initial form values', () => {
      component.ngOnInit();

      expect(component.postForm.get('title')?.value).toBe('');
      expect(component.postForm.get('body')?.value).toBe('');
      expect(component.postForm.get('userId')?.value).toBe(1);
    });
  });
});
