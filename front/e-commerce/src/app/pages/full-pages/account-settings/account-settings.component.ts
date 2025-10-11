import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { UserProfileService, UserProfile } from 'app/shared/services/user-profile.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss', '../../../../assets/sass/libs/select.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AccountSettingsComponent implements OnInit {

  activeTab = "general";
  generalFormSubmitted = false;
  changePasswordFormSubmitted = false;
  infoFormSubmitted = false;
  alertVisible = true;
  
  currentUser: Partial<UserProfile> = {};
  userId: number | undefined;
  userAvatar: string = 'assets/img/portrait/small/avatar-s-1.png';

  countries = [
      { value: "USA", name: 'USA' },
      { value: "UK", name: 'UK'},
      { value: "Canada", name: 'Canada' },
      { value: "Tunisia", name: 'Tunisia' },
  ];

  selectedLanguages = ["English"];
  languages = [
      { value: "English", name: 'English' },
      { value: "Spanish", name: 'Spanish'},
      { value: "French", name: 'French' },
      { value: "Russian", name: 'Russian' },
      { value: "German", name: 'German'},
      { value: "Hindi", name: 'Hindi' },
      { value: "Arabic", name: 'Arabic' },
      { value: "Sanskrit", name: 'Sanskrit'},
  ];

  selectedMusic = ["Jazz", "Hip Hop"];
  music = [
      { value: "Rock", name: 'Rock' },
      { value: "Jazz", name: 'Jazz'},
      { value: "Disco", name: 'Disco' },
      { value: "Pop", name: 'Pop' },
      { value: "Techno", name: 'Techno'},
      { value: "Folk", name: 'Folk' },
      { value: "Hip Hop", name: 'Hip Hop' },
  ];

  selectedMovies = ["The Dark Knight"];
  movies = [
      { value: "Avatar", name: 'Avatar' },
      { value: "The Dark Knight", name: 'The Dark Knight'},
      { value: "Harry Potter", name: 'Harry Potter' },
      { value: "Iron Man", name: 'Iron Man' },
      { value: "Spider Man", name: 'Spider Man'},
      { value: "Perl Harbour", name: 'Perl Harbour' },
      { value: "Airplane!", name: 'Airplane!' },
  ];

  generalForm = new UntypedFormGroup({
    username: new UntypedFormControl('', [Validators.required]),
    firstName: new UntypedFormControl('', [Validators.required]),
    lastName: new UntypedFormControl('', [Validators.required]),
    email: new UntypedFormControl('', [Validators.required, Validators.email]),
    company: new UntypedFormControl('')
  });

  changePasswordForm = new UntypedFormGroup({
    oldPassword: new UntypedFormControl('', [Validators.required]),
    newPassword: new UntypedFormControl('', [Validators.required, Validators.minLength(6)]),
    retypeNewPassword: new UntypedFormControl('', [Validators.required])
  });

  infoForm = new UntypedFormGroup({
    bdate: new UntypedFormControl(''),
    bio: new UntypedFormControl(''),
    phone: new UntypedFormControl(''),
    website: new UntypedFormControl(''),
    country: new UntypedFormControl('')
  });

  socialForm = new UntypedFormGroup({
    twitter: new UntypedFormControl(''),
    facebook: new UntypedFormControl(''),
    googlePlus: new UntypedFormControl(''),
    linkedin: new UntypedFormControl(''),
    instagram: new UntypedFormControl(''),
    quora: new UntypedFormControl('')
  });

  constructor(
    private userProfileService: UserProfileService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.loadUserData();
  }

  /**
   * Load user data from token and backend
   */
  loadUserData(): void {
    console.log('📊 Loading user data...');
    
    // Get basic user info from token
    this.currentUser = this.userProfileService.getUserFromToken();
    this.userId = this.currentUser.id;
    
    console.log('👤 User from token:', this.currentUser);

    if (this.currentUser) {
      // Populate general form with token data
      this.generalForm.patchValue({
        username: this.currentUser.username || '',
        firstName: this.currentUser.firstName || '',
        lastName: this.currentUser.lastName || '',
        email: this.currentUser.email || ''
      });

      // Set alert visibility based on verification status
      this.alertVisible = !this.currentUser.isVerified;

      // Load full profile from backend if userId exists
      if (this.userId) {
        this.loadFullProfile(this.userId);
      }
    }
  }

  /**
   * Load full profile from backend
   */
  loadFullProfile(userId: number): void {
    this.spinner.show();
    
    this.userProfileService.getUserProfile(userId).subscribe({
      next: (profile) => {
        console.log('✅ Full profile loaded:', profile);
        this.currentUser = profile;
        
        // Update all forms with full profile data
        this.generalForm.patchValue({
          username: profile.username,
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          company: profile.company || ''
        });

        this.infoForm.patchValue({
          bio: profile.bio || '',
          phone: profile.phone || '',
          website: profile.website || '',
          bdate: profile.birthDate || '',
          country: profile.country || ''
        });

        if (profile.socialLinks) {
          this.socialForm.patchValue(profile.socialLinks);
        }

        if (profile.avatar) {
          this.userAvatar = profile.avatar;
        }

        this.spinner.hide();
      },
      error: (error) => {
        console.error('❌ Error loading profile:', error);
        this.spinner.hide();
        // Continue with token data even if backend fails
      }
    });
  }

  setActiveTab(tab) {
    this.activeTab = tab;
  }

  get gf() {
    return this.generalForm.controls;
  }

  get cpf() {
    return this.changePasswordForm.controls;
  }

  get inf() {
    return this.infoForm.controls;
  }

  /**
   * Submit general form
   */
  onGeneralFormSubmit() {
    this.generalFormSubmitted = true;
    
    if (this.generalForm.invalid) {
      return;
    }

    if (!this.userId) {
      Swal.fire('Error', 'User ID not found', 'error');
      return;
    }

    this.spinner.show();

    const updateData = {
      username: this.generalForm.value.username,
      firstName: this.generalForm.value.firstName,
      lastName: this.generalForm.value.lastName,
      email: this.generalForm.value.email,
      company: this.generalForm.value.company
    };

    this.userProfileService.updateProfile(this.userId, updateData).subscribe({
      next: (updatedProfile) => {
        console.log('✅ Profile updated:', updatedProfile);
        this.spinner.hide();
        Swal.fire('Success', 'Profile updated successfully!', 'success');
        this.generalFormSubmitted = false;
      },
      error: (error) => {
        console.error('❌ Error updating profile:', error);
        this.spinner.hide();
        Swal.fire('Error', 'Failed to update profile', 'error');
      }
    });
  }

  /**
   * Submit change password form
   */
  onChangePasswordFormSubmit() {
    this.changePasswordFormSubmitted = true;
    
    if (this.changePasswordForm.invalid) {
      return;
    }

    const newPassword = this.changePasswordForm.value.newPassword;
    const retypePassword = this.changePasswordForm.value.retypeNewPassword;

    if (newPassword !== retypePassword) {
      Swal.fire('Error', 'New passwords do not match', 'error');
      return;
    }

    if (!this.userId) {
      Swal.fire('Error', 'User ID not found', 'error');
      return;
    }

    this.spinner.show();

    const passwordData = {
      oldPassword: this.changePasswordForm.value.oldPassword,
      newPassword: newPassword
    };

    this.userProfileService.changePassword(this.userId, passwordData).subscribe({
      next: () => {
        console.log('✅ Password changed successfully');
        this.spinner.hide();
        Swal.fire('Success', 'Password changed successfully!', 'success');
        this.changePasswordForm.reset();
        this.changePasswordFormSubmitted = false;
      },
      error: (error) => {
        console.error('❌ Error changing password:', error);
        this.spinner.hide();
        Swal.fire('Error', error.error || 'Failed to change password', 'error');
      }
    });
  }

  /**
   * Submit info form
   */
  onInfoFormSubmit() {
    this.infoFormSubmitted = true;
    
    if (this.infoForm.invalid) {
      return;
    }

    if (!this.userId) {
      Swal.fire('Error', 'User ID not found', 'error');
      return;
    }

    this.spinner.show();

    const infoData = {
      bio: this.infoForm.value.bio,
      phone: this.infoForm.value.phone,
      website: this.infoForm.value.website,
      birthDate: this.infoForm.value.bdate,
      country: this.infoForm.value.country
    };

    this.userProfileService.updateProfile(this.userId, infoData).subscribe({
      next: () => {
        console.log('✅ Info updated successfully');
        this.spinner.hide();
        Swal.fire('Success', 'Information updated successfully!', 'success');
        this.infoFormSubmitted = false;
      },
      error: (error) => {
        console.error('❌ Error updating info:', error);
        this.spinner.hide();
        Swal.fire('Error', 'Failed to update information', 'error');
      }
    });
  }

  /**
   * Submit social form
   */
  onSocialFormSubmit() {
    if (this.socialForm.invalid) {
      return;
    }

    // Note: You'll need to add a backend endpoint for social links
    console.log('Social links:', this.socialForm.value);
    Swal.fire('Info', 'Social links feature coming soon!', 'info');
  }

  /**
   * Handle file upload for avatar
   */
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    
    if (!file) {
      return;
    }

    if (!this.userId) {
      Swal.fire('Error', 'User ID not found', 'error');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      Swal.fire('Error', 'Please select an image file', 'error');
      return;
    }

    // Validate file size (max 800KB)
    if (file.size > 800 * 1024) {
      Swal.fire('Error', 'Image size should be less than 800KB', 'error');
      return;
    }

    this.spinner.show();

    this.userProfileService.uploadAvatar(this.userId, file).subscribe({
      next: (response) => {
        console.log('✅ Avatar uploaded:', response);
        this.userAvatar = response.avatarUrl || this.userAvatar;
        this.spinner.hide();
        Swal.fire('Success', 'Avatar uploaded successfully!', 'success');
      },
      error: (error) => {
        console.error('❌ Error uploading avatar:', error);
        this.spinner.hide();
        Swal.fire('Error', 'Failed to upload avatar', 'error');
      }
    });
  }

  /**
   * Reset avatar to default
   */
  resetAvatar(): void {
    this.userAvatar = 'assets/img/portrait/small/avatar-s-1.png';
    Swal.fire('Success', 'Avatar reset to default', 'success');
  }
}
