import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AdminDataTableComponent, TableColumn } from './admin-data-table.component';

describe('AdminDataTableComponent', () => {
  let component: AdminDataTableComponent;
  let fixture: ComponentFixture<AdminDataTableComponent>;

  const mockColumns: TableColumn[] = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'status', label: 'Status', type: 'badge' },
    { key: 'createdAt', label: 'Date', type: 'date', sortable: true },
    { key: 'active', label: 'Active', type: 'boolean' },
  ];

  const mockData = [
    { _id: '1', title: 'Project One', status: 'published', createdAt: '2026-09-01T00:00:00Z', active: true },
    { _id: '2', title: 'Project Two', status: 'draft', createdAt: '2026-09-02T00:00:00Z', active: false },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDataTableComponent, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDataTableComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('columns', mockColumns);
    fixture.componentRef.setInput('data', mockData);
    fixture.componentRef.setInput('totalItems', 2);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render table headers for all columns', () => {
    const headers = fixture.nativeElement.querySelectorAll('thead th');
    // 4 columns + 1 actions column = 5
    expect(headers.length).toBe(5);
    expect(headers[0].textContent).toContain('Title');
    expect(headers[1].textContent).toContain('Status');
  });

  it('should render data rows accurately', () => {
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
    expect(rows[0].textContent).toContain('Project One');
    expect(rows[0].textContent).toContain('published');
    expect(rows[1].textContent).toContain('Project Two');
    expect(rows[1].textContent).toContain('draft');
  });

  it('should emit searchChange on search input and clear search', () => {
    const searchSpy = vi.spyOn(component.searchChange, 'emit');

    component.onSearchInput('angular');
    expect(searchSpy).toHaveBeenCalledWith('angular');
    expect(component.searchTerm).toBe('angular');

    component.clearSearch();
    expect(searchSpy).toHaveBeenCalledWith('');
    expect(component.searchTerm).toBe('');
  });

  it('should emit filterChange on filter select', () => {
    const filterSpy = vi.spyOn(component.filterChange, 'emit');
    component.onFilterSelect('published');
    expect(filterSpy).toHaveBeenCalledWith('published');
  });

  it('should emit sortChange and toggle sort directions', () => {
    const sortSpy = vi.spyOn(component.sortChange, 'emit');

    // First sort click on 'title' -> asc
    component.onSort('title');
    expect(sortSpy).toHaveBeenCalledWith({ key: 'title', direction: 'asc' });

    // Second sort click on 'title' -> desc
    component.onSort('title');
    expect(sortSpy).toHaveBeenCalledWith({ key: 'title', direction: 'desc' });

    // Sort click on another column -> asc
    component.onSort('createdAt');
    expect(sortSpy).toHaveBeenCalledWith({ key: 'createdAt', direction: 'asc' });
  });

  it('should emit pageChange when navigating pages', () => {
    fixture.componentRef.setInput('totalItems', 50);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.componentRef.setInput('currentPage', 2);
    fixture.detectChanges();

    const pageSpy = vi.spyOn(component.pageChange, 'emit');

    component.onPageChange(3);
    expect(pageSpy).toHaveBeenCalledWith(3);

    component.onPageChange(1);
    expect(pageSpy).toHaveBeenCalledWith(1);

    // Invalid pages shouldn't emit
    component.onPageChange(0);
    component.onPageChange(999);
    expect(pageSpy).not.toHaveBeenCalledWith(0);
    expect(pageSpy).not.toHaveBeenCalledWith(999);
  });

  it('should emit editClick, deleteClick, and viewClick', () => {
    const editSpy = vi.spyOn(component.editClick, 'emit');
    const deleteSpy = vi.spyOn(component.deleteClick, 'emit');
    const viewSpy = vi.spyOn(component.viewClick, 'emit');
    const publishSpy = vi.spyOn(component.togglePublishClick, 'emit');

    component.editClick.emit(mockData[0]);
    expect(editSpy).toHaveBeenCalledWith(mockData[0]);

    component.deleteClick.emit(mockData[1]);
    expect(deleteSpy).toHaveBeenCalledWith(mockData[1]);

    component.viewClick.emit(mockData[0]);
    expect(viewSpy).toHaveBeenCalledWith(mockData[0]);

    component.togglePublishClick.emit(mockData[0]);
    expect(publishSpy).toHaveBeenCalledWith(mockData[0]);
  });

  it('should display empty state when data is empty and not loading', () => {
    fixture.componentRef.setInput('data', []);
    fixture.componentRef.setInput('totalItems', 0);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('No records found.');
  });

  it('should display loading skeleton when isLoading is true', () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    const animatedSkeletons = fixture.nativeElement.querySelectorAll('.animate-pulse');
    expect(animatedSkeletons.length).toBeGreaterThan(0);
  });
});
