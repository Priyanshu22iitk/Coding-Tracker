from django.db import models

class CodingProblem(models.Model):
    DIFFICULTY_CHOICES = [
        ('Easy', 'Easy'),
        ('Medium', 'Medium'),
        ('Hard', 'Hard'),
    ]

    title = models.CharField(max_length=200)
    problem_url = models.URLField(blank=True, null=True)
    platform = models.CharField(max_length=100)  # e.g., LeetCode, Codeforces
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, default='Easy')
    solution_notes = models.TextField(blank=True, null=True)
    date_solved = models.DateField(auto_now_add=True)  # Automatically captures the date

    def __str__(self):
        return f"{self.title} ({self.platform})"