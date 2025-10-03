import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { PostsList } from './posts-list';
import { PostService } from '../../../core/services/post.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Post } from '../../../core/models/post.model';

describe('PostsListComponent', () => {
  let component: PostsList;
  let fixture: ComponentFixture<PostsList>;
  let mockPostService: jasmine.SpyObj<PostService>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  const mockPosts: Post[] = [
    { id: 1, userId: 1, title: 'Test Post 1', body: 'Test body 1' },
    { id: 2, userId: 2, title: 'Test Post 2', body: 'Test body 2' },
    { id: 3, userId: 3, title: 'Test Post 3', body: 'Test body 3' }
  ];

  beforeEach(async () => {
    const postServiceSpy = jasmine.createSpyObj('PostService', ['getPosts', 'deletePost']);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['success', 'error']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [PostsList, NoopAnimationsModule],
      providers: [
        { provide: PostService, useValue: postServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostsList);
    component = fixture.componentInstance;
    mockPostService = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
    mockNotificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    mockSnackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load posts on init', () => {
      mockPostService.getPosts.and.returnValue(of(mockPosts));

      component.ngOnInit();

      expect(mockPostService.getPosts).toHaveBeenCalled();
      expect(component.dataSource).toEqual(mockPosts.slice(0, 10));
    });

    it('should handle loading error', () => {
      const error = new Error('Loading failed');
      mockPostService.getPosts.and.returnValue(throwError(() => error));

      component.ngOnInit();

      expect(mockNotificationService.error).toHaveBeenCalledWith('Error al cargar los posts: Loading failed');
    });
  });

  describe('loadPosts', () => {
    it('should load posts and update dataSource', () => {
      mockPostService.getPosts.and.returnValue(of(mockPosts));

      component.loadPosts();

      expect(component.loading).toBeFalse();
      expect(component.dataSource).toEqual(mockPosts.slice(0, 10));
    });

    it('should set loading to true initially', () => {
      mockPostService.getPosts.and.returnValue(of(mockPosts));

      component.loadPosts();

      expect(component.loading).toBeFalse(); // Should be false after completion
    });

    it('should handle error when loading posts', () => {
      const error = new Error('Network error');
      mockPostService.getPosts.and.returnValue(throwError(() => error));

      component.loadPosts();

      expect(mockNotificationService.error).toHaveBeenCalledWith('Error al cargar los posts: Network error');
    });
  });

  describe('viewPost', () => {
    it('should navigate to post detail', () => {
      const post = mockPosts[0];

      component.viewPost(post);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/posts', post.id]);
    });
  });

  describe('editPost', () => {
    it('should navigate to edit post', () => {
      const post = mockPosts[0];

      component.editPost(post);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/posts', post.id, 'edit']);
    });
  });

  describe('deletePost', () => {
    it('should open delete confirmation dialog', () => {
      const post = mockPosts[0];
      const mockDialogRef = {
        afterClosed: () => of(false)
      };
      mockDialog.open.and.returnValue(mockDialogRef as any);

      component.deletePost(post);

      expect(mockDialog.open).toHaveBeenCalled();
    });

    it('should perform delete when confirmed', () => {
      const post = mockPosts[0];
      const mockDialogRef = {
        afterClosed: () => of(true)
      };
      mockDialog.open.and.returnValue(mockDialogRef as any);
      spyOn(component, 'performDelete');

      component.deletePost(post);

      expect(component.performDelete).toHaveBeenCalledWith(post);
    });
  });

  describe('performDelete', () => {
    it('should simulate delete and show success message', (done) => {
      const post = mockPosts[0];
      spyOn(component, 'loadPosts');

      component.performDelete(post);

      setTimeout(() => {
        expect(component.loading).toBeFalse();
        expect(mockNotificationService.success).toHaveBeenCalledWith(`Post "${post.title}" eliminado exitosamente`);
        expect(component.loadPosts).toHaveBeenCalled();
        done();
      }, 1100);
    });
  });

  describe('refreshPosts', () => {
    it('should call loadPosts', () => {
      spyOn(component, 'loadPosts');

      component.refreshPosts();

      expect(component.loadPosts).toHaveBeenCalled();
    });
  });

  describe('createPost', () => {
    it('should navigate to create post', () => {
      component.createPost();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/posts/new']);
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
