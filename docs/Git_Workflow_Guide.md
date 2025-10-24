# Git Commands & Workflow Guide

This document provides a professional Git workflow for parallel backend
and frontend development. It includes all essential commands for
creating branches, committing work, pulling, pushing, and merging
changes.

## 1. Initial Setup

\# Clone the repository (if not done yet)\
git clone \<repo-url\>\
cd \<project-folder\>\
\
\# Check current branches\
git branch -a\
\
\# Create dev branch (only once if not already)\
git checkout -b dev\
git push origin dev

## 2. Creating Feature Branches

\# For Backend Development\
git checkout dev\
git pull origin dev\
git checkout -b feature/backend-yourfeature\
\
\# For Frontend Development\
git checkout dev\
git pull origin dev\
git checkout -b feature/frontend-yourfeature

## 3. Committing Work

\# Stage changes\
git add .\
\
\# Commit changes with a descriptive message\
git commit -m \"Implemented authentication routes\"\
\
\# Push branch to remote\
git push origin feature/backend-yourfeature

## 4. Pulling Latest Changes

\# Always pull before starting new work\
git checkout dev\
git pull origin dev\
\
\# If you\'re on your feature branch and want to update it with latest
dev changes\
git checkout feature/backend-yourfeature\
git pull origin dev \--rebase

## 5. Merging Branches

\# Merge your feature branch into dev when ready\
git checkout dev\
git pull origin dev\
git merge feature/backend-yourfeature\
\
\# Resolve conflicts if any, then push\
git push origin dev\
\
\# Once stable and tested\
git checkout main\
git pull origin main\
git merge dev\
git push origin main

## 6. Committing Entire Work (for your current progress)

\# Add all changes\
git add .\
\
\# Commit with message\
git commit -m \"Completed backend + integrated frontend changes\"\
\
\# Push to remote repository\
git push origin \<your-branch-name\>

## 7. Useful Git Commands

\# Check current status\
git status\
\
\# See all branches\
git branch\
\
\# Create new branch\
git checkout -b \<branch-name\>\
\
\# Switch to another branch\
git checkout \<branch-name\>\
\
\# Delete local branch\
git branch -d \<branch-name\>\
\
\# Delete remote branch\
git push origin \--delete \<branch-name\>\
\
\# View commit history\
git log \--oneline \--graph \--decorate \--all

## 8. Notes

\- Always pull latest changes from dev before starting work.\
- Never push directly to main branch.\
- Keep commit messages short and descriptive.\
- Communicate API or structure changes before merging.
