import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AssociateService } from '../associate.service';
import { Associate } from '../associate.model';
import { Chart } from 'chart.js/auto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';


@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css'],
})

export class KanbanComponent implements OnInit {
  showModal: boolean = false;
  searchQuery: string = '';
  associates: Associate[] = [];
  programmingLanguages: string[] = [];
  qualificationLevels: string[] = [];
  levelChart: any;
languageChart: any;
filteredAssociates: Associate[] = [];

hoveredAssociate: Associate | null = null;
tooltipX = 0;
tooltipY = 0;
 
  


onMouseEnter(event: MouseEvent, associate: Associate) {
  console.log('Associate Data:', associate);
  this.hoveredAssociate = { ...associate };
  this.tooltipX = event.clientX + 10;
  this.tooltipY = event.clientY + 10;
}

onMouseLeave() {
    this.hoveredAssociate = null;
}


loggedInUser = '';
newAssociateName: string = '';
  newAssociateLanguage: string = this.programmingLanguages[0]; // Default to first language
  newAssociateLevel: string = this.qualificationLevels[0];
    
  isLanguageModalOpen = false;    // To control visibility of modal
newLanguageName: string = '';   // To capture new language input

 
  constructor(
    private associateService: AssociateService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }
  
  
  ngOnInit(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.loggedInUser = currentUser.username; 
    this.loadAssociates();
    this.loadProgrammingLanguages();
    this.loadQualificationLevels();
    this.loadStats();
    this.loadSkills();
    
    
  }
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
}
  triggerChangeDetection() {
    this.cdr.detectChanges();
}

  
applySearchFilter() {
  const query = this.searchQuery.trim().toLowerCase();
  if (!query) {
    this.filteredAssociates = [...this.associates]; // Reset filter if search is cleared
  } else {
    this.filteredAssociates = this.associates.filter(a =>
      a.name.toLowerCase().includes(query) ||
      a.programmingLanguage.toLowerCase().includes(query) ||
      a.qualificationLevel.toLowerCase().includes(query)
    );
  }
  this.updateCharts();
}
filterBoard() {
  const query = this.searchQuery.trim().toLowerCase();

  if (!query) {
    this.filteredAssociates = [...this.associates]; // No filter applied, show all
    return;
  }

  this.filteredAssociates = this.associates.filter((associate) => {
    return (
      associate.name.toLowerCase().includes(query) ||
      associate.programmingLanguage.toLowerCase().includes(query) ||
      associate.qualificationLevel.toLowerCase().includes(query)
      
    );
    
  });
}



  loadAssociates() {
    this.associateService.getAssociates().subscribe(data => {
      this.associates = data;
      this.filterBoard();
      console.log('Loaded associates:', this.associates);
    });
  }

  loadProgrammingLanguages() {
    this.associateService.getProgrammingLanguages().subscribe(data => {
      this.programmingLanguages = data;
      console.log('Loaded programming languages:', this.programmingLanguages);
    });
  }


addAssociate() {
  if (this.newAssociateName.trim() === '') {
    this.snackBar.open('Please enter a valid associate name.', 'Close', {
      duration: 3000,
      panelClass: ['warning-snackbar']
    });
      return;
  }
  const isDuplicate = this.associates.some(
    (a) =>
      a.name.trim().toLowerCase() === this.newAssociateName.trim().toLowerCase() &&
      a.programmingLanguage === this.newAssociateLanguage &&
      a.qualificationLevel === this.newAssociateLevel
  );

if (isDuplicate) {
  this.snackBar.open('This associate already exists in this programming language!', 'Close', {
    duration: 3000,
    panelClass: ['warning-snackbar']
  });
    this.closeModal();
    return;  // Don't proceed if duplicate
}

if (!this.qualificationLevels.includes(this.newAssociateLevel)) {
  this.qualificationLevels.push(this.newAssociateLevel);
  this.qualificationLevels.sort();  // Optional: Keep levels sorted if needed
}

  const newAssociate = {
      name: this.newAssociateName,
      programmingLanguage: this.newAssociateLanguage,
      qualificationLevel: this.newAssociateLevel,
      isEditing: false,
      dateAdded: new Date().toISOString().split('T')[0], 
  };

  this.associateService.addAssociate(newAssociate).subscribe({
      next: (savedAssociate) => {
          this.associates.push(savedAssociate); // Add saved associate to list
          this.filterBoard();     
          this.updateCharts();
          this.resetForm();
          this.snackBar.open('Associate added successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.closeModal();  
          this.cdr.detectChanges(); // <<< Close the modal after success
      },
      error: (err) => {
          console.error('Failed to add associate', err);
          alert('Failed to save associate. Please try again.');
      }
  });
}
saveNewLanguage() {
  const trimmedLanguage = this.newLanguageName.trim();

  if (trimmedLanguage === '') {
    this.snackBar.open('Please enter a valid language name.', 'Close', {
      duration: 3000,
      panelClass: ['warning-snackbar']
    });
    return;
  }

  // Case-insensitive check to prevent duplicates like "Java" and "java"
  const isDuplicate = this.programmingLanguages.some(lang => lang.toLowerCase() === trimmedLanguage.toLowerCase());
  
  if (isDuplicate) {
    this.snackBar.open('This language already exists.', 'Close', {
      duration: 3000,
      panelClass: ['warning-snackbar']
    });
    this.closeLanguageModal();
    return;
  }

  // Add language in consistent case (like capitalized)
  this.programmingLanguages.push(this.capitalize(trimmedLanguage));
  this.closeLanguageModal();

  this.snackBar.open('New programming language added successfully!', 'Close', {
    duration: 3000,
    panelClass: ['success-snackbar']
  });

  // Optionally trigger chart refresh if needed
  //this.updateSkillDistributionChart();
}
capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}


  resetForm() {
    this.newAssociateName = '';
    this.newAssociateLanguage = '';
    this.newAssociateLevel = '';
  }

  generateId(): number {
    return this.associates.length > 0 ? Math.max(...this.associates.map(a => a.id)) + 1 : 1;
  }

  updateCharts() {
    if (this.levelChart) {
      this.levelChart.destroy();
      this.levelChart = null; // Destroy old chart instance
    }
    if (this.languageChart) {
      this.languageChart.destroy();
      this.levelChart = null;
    }
    const levelCount = this.countBy(this.filteredAssociates, 'qualificationLevel');
    const languageCount = this.countBy(this.filteredAssociates, 'programmingLanguage');
    this.createChart(levelCount, "levelChart", "Associates per Level");
    this.createChart(languageCount, "languageChart", "Skills Distribution");
    this.loadStats(); // Reload statistics and re-render charts
    this.loadSkills(); // Reload skill distribution data
  }
  
  

  loadQualificationLevels() {
    this.associateService.getQualificationLevels().subscribe(data => {
      this.qualificationLevels = data;
      console.log('Loaded qualification levels:', this.qualificationLevels);
    });
  }

  onDrop(event: DragEvent, newLanguage: string, newLevel: string) {
    event.preventDefault();

    if (!event.dataTransfer) {
      console.error('Drop failed: dataTransfer is not available');
      return;
    }

    const data = event.dataTransfer.getData('application/json');
    if (!data) {
      console.warn('Drop failed: No data found');
      return;
    }

    const droppedAssociate: Associate = JSON.parse(data);
    console.log('Dropped Associate:', droppedAssociate);
    

    
    // Find the associate in the list
    const index = this.associates.findIndex(a => a.id === droppedAssociate.id);
    if (index !== -1) {
      this.associates[index] = {
        ...this.associates[index],
        qualificationLevel: newLevel,
        programmingLanguage: newLanguage
      };

      // Call API to update in the database
      
      this.updateAssociate(this.associates[index]);
      this.updateCharts();

      // Refresh UI
      this.associates = [...this.associates];
      this.filterBoard();
      this.cdr.detectChanges();
    }
  }
  updateAssociate(associate: Associate) {
    this.associateService.updateAssociate(associate.id, associate).subscribe({
      next: (response) => {
      console.log("Associate updated successfully", response);
      this.updateCharts();
      },
      error: (error) => console.error(" Error updating associate", error)
    });
  }
  
  onDragStart(event: DragEvent, associate: Associate) {
    if (!event.dataTransfer) {
      console.error('DragStart failed: dataTransfer is not available');
      return;
    }

    event.dataTransfer.setData('application/json', JSON.stringify(associate));
    event.dataTransfer.effectAllowed = 'move';
    console.log('Dragging:', associate);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
  }

  getFilteredAssociates(language: string, level: string, source: Associate[] = this.associates): Associate[] {
    const query = this.searchQuery.trim().toLowerCase();

    return source.filter(a => {
        const matchesLanguage = a.programmingLanguage.trim().toLowerCase() === language.trim().toLowerCase();
        const matchesLevel = a.qualificationLevel.trim().toLowerCase() === level.trim().toLowerCase();

        // Search can match either name, qualificationLevel, or programmingLanguage
        const matchesSearch = !query || (
            a.name.toLowerCase().includes(query) ||
            a.qualificationLevel.toLowerCase().includes(query) ||
            a.programmingLanguage.toLowerCase().includes(query)
        );

        return matchesLanguage && matchesLevel && matchesSearch;
    });
  }
  editAssociate(associate: any) {
    associate.isEditing = true;
  }

  saveAssociate(associate: any) {
    associate.isEditing = false;
    this.associateService.updateAssociate(associate.id, associate).subscribe();
  }

  selectLanguage(lang: string) {
    this.newAssociateLanguage = lang;
  }
  
  
  
    
    

  deleteAssociate(associate: Associate) {
    if (!confirm(`Are you sure you want to delete ${associate.name}?`)) return;
  
    this.associateService.deleteAssociate(associate.id).subscribe({
      next: () => {
        console.log(` Associate ${associate.name} deleted successfully`);
  
        //  Remove from UI
        this.associates = this.associates.filter(a => a.id !== associate.id);
        const isLevelEmpty = !this.associates.some(a => a.qualificationLevel === associate.qualificationLevel);
        if (isLevelEmpty) {
            this.qualificationLevels = this.qualificationLevels.filter(l => l !== associate.qualificationLevel);
        }

        const isLanguageUnused = !this.associates.some(a => a.programmingLanguage === associate.programmingLanguage);

        if (isLanguageUnused) {
            this.programmingLanguages = this.programmingLanguages.filter(lang => lang !== associate.programmingLanguage);
            console.log(`Removed unused language: ${associate.programmingLanguage}`);
        }
        this.filterBoard();
        this.cdr.detectChanges();
  
        //  Update Charts after deletion
        this.updateCharts();
      },
      error: (error) => console.error(" Error deleting associate:", error)
    });
  }
  

  downloadKanbanAsHtml() {
    this.associateService.downloadKanbanHtml().subscribe(htmlContent => {
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'kanban-board.html';
      link.click();
      URL.revokeObjectURL(link.href);
    });
  }
  loadStats() {
    this.associateService.getStats().subscribe((data: any) => {
      
      this.createChart(data.levelCount, "levelChart", "Associates per Level");
      this.createChart(data.languageCount, "languageChart", "Skills Distribution");
    });
  }

  countBy(array: any[], key: string): { [key: string]: number } {
    return array.reduce((acc, item) => {
        const value = item[key];
        if (acc[value]) {
            acc[value]++;
        } else {
            acc[value] = 1;
        }
        return acc;
    }, {} as { [key: string]: number });
}

  loadSkills() {
    this.associateService.getSkillDistribution().subscribe(data => {
      console.log("Skills Distribution Updated:", data); //  Debug log
      if (this.languageChart) {
        this.languageChart.destroy(); //  Ensure chart is fully destroyed before creating a new one
      }
      const languageCount = this.countBy(this.filteredAssociates, 'programmingLanguage'); 
this.createChart(languageCount, "languageChart", "Skills Distribution");

    });
  }

  
generateColors(count: number): string[] {
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
      const hue = (i * 137) % 360;  // Use golden angle for better color distribution
      colors.push(`hsl(${hue}, 70%, 50%)`);
  }
  return colors;
}

  
  createChart(data: any, elementId: string, title: string) {
    const canvas = document.getElementById(elementId) as HTMLCanvasElement;
    if (!canvas) {
      console.error(`Chart element ${elementId} not found.`);
      return;
    }
    
    const labels = Object.keys(data);
const colors = this.generateColors(labels.length);
  
    const chartInstance = new Chart(canvas, {
      type: "bar",
      data: {
        labels: Object.keys(data),
        datasets: [{
          label: title,
          data: Object.values(data),
          backgroundColor: colors,
          borderColor: colors.map(() => 'black'),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        animation: false,
        scales: {
        x: {
          ticks: {
              maxRotation: 0, // Force straight
              minRotation: 0
          }
      }
    },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false,
            animation: false,
            callbacks: {
              label: function (tooltipItem: any) {
                return `${title}: ${tooltipItem.raw}`;
              }
            }
          }
        }
      }
    });
  
    // Save reference to chart instances
    if (elementId === "levelChart") {
      this.levelChart = chartInstance;
    } else if (elementId === "languageChart") {
      this.languageChart = chartInstance;
    }
  }
 

    isModalOpen = false;

    associate = {
        name: '',
        language: 'java',
        qualificationLevel: 'L1'
    };

    openModal() {
        this.isModalOpen = true;
        this.resetForm();
    }

    closeModal() {
        this.isModalOpen = false;
        this.resetForm();
    }

    saveAssociate1() {
        console.log('Saving associate:', this.associate);
       
    }

    openLanguageModal() {
      this.newLanguageName = ''; // Reset input every time
      this.isLanguageModalOpen = true;
    }
    
    closeLanguageModal() {
      this.isLanguageModalOpen = false;
    }
   
   
  
  
}  