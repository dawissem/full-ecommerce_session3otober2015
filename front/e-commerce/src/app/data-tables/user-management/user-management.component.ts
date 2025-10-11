import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { UserManagementService } from 'app/shared/services/user-management.service';
import { User, UpdateUserRequest, UserStats } from 'app/shared/models/user.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;

  rows: User[] = [];
  temp: User[] = [];
  selected: User[] = [];
  stats: UserStats = { totalUsers: 0, verifiedUsers: 0, unverifiedUsers: 0 };
  
  // Editing
  editing: { [key: number]: boolean } = {};
  editingUser: { [key: number]: User } = {};

  // Pagination
  page = {
    limit: 10,
    count: 0,
    offset: 0,
    pageSize: 10
  };

  constructor(
    private userService: UserManagementService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadStats();
  }

  /**
   * Load all users
   */
  loadUsers(): void {
    this.spinner.show();
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        console.log('✅ Users loaded:', users);
        this.rows = users;
        this.temp = [...users];
        this.page.count = users.length;
        this.spinner.hide();
      },
      error: (error) => {
        console.error('❌ Error loading users:', error);
        Swal.fire('Error', 'Failed to load users', 'error');
        this.spinner.hide();
      }
    });
  }

  /**
   * Load user statistics
   */
  loadStats(): void {
    this.userService.getUserStats().subscribe({
      next: (stats) => {
        console.log('📊 Stats loaded:', stats);
        this.stats = stats;
      },
      error: (error) => {
        console.error('❌ Error loading stats:', error);
      }
    });
  }

  /**
   * Filter data based on search input
   */
  filterUpdate(event: any): void {
    const val = event.target.value.toLowerCase();

    const temp = this.temp.filter((user) => {
      return (
        user.firstName.toLowerCase().indexOf(val) !== -1 ||
        user.lastName.toLowerCase().indexOf(val) !== -1 ||
        user.email.toLowerCase().indexOf(val) !== -1 ||
        user.role.toLowerCase().indexOf(val) !== -1 ||
        !val
      );
    });

    this.rows = temp;
    this.table.offset = 0;
  }

  /**
   * Enable editing for a row
   */
  onEditStart(row: User): void {
    this.editing[row.id] = true;
    this.editingUser[row.id] = { ...row };
  }

  /**
   * Cancel editing
   */
  onEditCancel(row: User): void {
    this.editing[row.id] = false;
    delete this.editingUser[row.id];
  }

  /**
   * Save edited user
   */
  onEditSave(row: User): void {
    const editedUser = this.editingUser[row.id];
    
    const updateRequest: UpdateUserRequest = {
      firstName: editedUser.firstName,
      lastName: editedUser.lastName,
      email: editedUser.email,
      role: editedUser.role,
      isVerified: editedUser.isVerified,
      isEnabled: editedUser.isEnabled
    };

    this.spinner.show();
    this.userService.updateUser(row.id, updateRequest).subscribe({
      next: (updatedUser) => {
        console.log('✅ User updated:', updatedUser);
        
        // Update the row in the table
        const index = this.rows.findIndex(u => u.id === row.id);
        if (index !== -1) {
          this.rows[index] = updatedUser;
          this.temp = [...this.rows];
          this.rows = [...this.rows]; // Trigger change detection
        }

        this.editing[row.id] = false;
        delete this.editingUser[row.id];
        
        this.spinner.hide();
        Swal.fire('Success', 'User updated successfully', 'success');
        this.loadStats(); // Reload stats
      },
      error: (error) => {
        console.error('❌ Error updating user:', error);
        this.spinner.hide();
        Swal.fire('Error', 'Failed to update user', 'error');
      }
    });
  }

  /**
   * Delete user
   */
  onDelete(row: User): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${row.fullName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.userService.deleteUser(row.id).subscribe({
          next: () => {
            console.log('✅ User deleted');
            
            // Remove from table
            this.rows = this.rows.filter(u => u.id !== row.id);
            this.temp = [...this.rows];
            this.page.count = this.rows.length;
            
            this.spinner.hide();
            Swal.fire('Deleted!', 'User has been deleted.', 'success');
            this.loadStats(); // Reload stats
          },
          error: (error) => {
            console.error('❌ Error deleting user:', error);
            this.spinner.hide();
            Swal.fire('Error', 'Failed to delete user', 'error');
          }
        });
      }
    });
  }

  /**
   * Toggle user status
   */
  onToggleStatus(row: User): void {
    const action = row.isEnabled ? 'disable' : 'enable';
    
    Swal.fire({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} User?`,
      text: `Do you want to ${action} ${row.fullName}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Yes, ${action} it!`
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.userService.toggleUserStatus(row.id).subscribe({
          next: () => {
            console.log('✅ User status toggled');
            
            // Update in table
            const index = this.rows.findIndex(u => u.id === row.id);
            if (index !== -1) {
              this.rows[index].isEnabled = !this.rows[index].isEnabled;
              this.rows = [...this.rows]; // Trigger change detection
            }
            
            this.spinner.hide();
            Swal.fire('Success', `User has been ${action}d`, 'success');
          },
          error: (error) => {
            console.error('❌ Error toggling user status:', error);
            this.spinner.hide();
            Swal.fire('Error', 'Failed to toggle user status', 'error');
          }
        });
      }
    });
  }

  /**
   * Get badge class based on status
   */
  getStatusBadge(isEnabled: boolean): string {
    return isEnabled ? 'badge-success' : 'badge-danger';
  }

  getVerifiedBadge(isVerified: boolean): string {
    return isVerified ? 'badge-success' : 'badge-warning';
  }

  /**
   * Page change event
   */
  onPage(event: any): void {
    console.log('Page event:', event);
  }

  /**
   * Refresh data
   */
  refresh(): void {
    this.loadUsers();
    this.loadStats();
  }
}
