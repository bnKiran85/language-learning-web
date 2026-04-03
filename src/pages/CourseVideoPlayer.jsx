// CourseVideoPlayer.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  CircularProgress
} from '@mui/material';
import {
  Close,
  PlayCircleOutline,
  CheckCircle,
  Lock
} from '@mui/icons-material';

const CourseVideoPlayer = ({ open, onClose, course, currentLessonIndex = 0 }) => {
  // Declare all hooks at the top level
  const [activeLesson, setActiveLesson] = useState(currentLessonIndex);
  const [loading, setLoading] = useState(true);

  // Effect for handling lesson changes
  useEffect(() => {
    if (course && course.lessons) {
      if (activeLesson >= course.lessons.length) {
        setActiveLesson(0);
      }
      
      // Simulate video loading
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [activeLesson, course]);

  const handleLessonChange = (index) => {
    if (course && index <= course.lessonsCompleted) {
      setActiveLesson(index);
      setLoading(true);
    }
  };

  // Early return for invalid course data
  if (!course || !course.lessons || course.lessons.length === 0) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm">
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Error</Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            No lessons available for this course. Please try again later.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={onClose}
            sx={{ mt: 2 }}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  // Get current lesson safely
  const currentLesson = course.lessons[activeLesson] || course.lessons[0];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: '80vh',
          maxHeight: '90vh',
          borderRadius: 2
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid rgba(0,0,0,0.1)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6">
            {course.title} - {currentLesson.title}
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, display: 'flex', height: '100%', flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ width: { xs: '100%', md: '70%' }, p: 2 }}>
          {/* Video Player */}
          <Box sx={{ 
            width: '100%', 
            position: 'relative',
            paddingTop: '56.25%',
            bgcolor: 'black',
            borderRadius: 1,
            overflow: 'hidden'
          }}>
            {loading ? (
              <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'black'
              }}>
                <CircularProgress color="primary" />
              </Box>
            ) : (
              <iframe
                src={currentLesson.videoUrl}
                title={currentLesson.title}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 0
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </Box>

          {/* Lesson Description */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              {currentLesson.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {currentLesson.description}
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                variant="outlined" 
                disabled={activeLesson === 0}
                onClick={() => handleLessonChange(activeLesson - 1)}
              >
                Previous Lesson
              </Button>
              <Button 
                variant="contained" 
                disabled={activeLesson >= course.lessons.length - 1 || activeLesson >= course.lessonsCompleted}
                onClick={() => handleLessonChange(activeLesson + 1)}
              >
                Next Lesson
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Lesson List */}
        <Box sx={{ 
          width: { xs: '100%', md: '30%' }, 
          borderLeft: { xs: 'none', md: '1px solid rgba(0,0,0,0.1)' },
          borderTop: { xs: '1px solid rgba(0,0,0,0.1)', md: 'none' },
          bgcolor: 'background.default',
          overflow: 'auto'
        }}>
          <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Course Progress: {Math.round((course.lessonsCompleted / course.lessons.length) * 100)}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {course.lessonsCompleted} of {course.lessons.length} lessons completed
            </Typography>
          </Box>
          <List sx={{ p: 0 }}>
            {course.lessons.map((lesson, index) => (
              <React.Fragment key={lesson.id || index}>
                <ListItem
                  button
                  selected={index === activeLesson}
                  onClick={() => handleLessonChange(index)}
                  disabled={index > course.lessonsCompleted}
                  sx={{
                    px: 2,
                    py: 1.5,
                    opacity: index > course.lessonsCompleted ? 0.6 : 1,
                    bgcolor: index === activeLesson ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                    '&:hover': {
                      bgcolor: index === activeLesson ? 'rgba(25, 118, 210, 0.12)' : 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {index < course.lessonsCompleted ? (
                      <CheckCircle fontSize="small" color="success" />
                    ) : index === course.lessonsCompleted ? (
                      <PlayCircleOutline fontSize="small" color="primary" />
                    ) : (
                      <Lock fontSize="small" color="action" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={lesson.title}
                    secondary={`Duration: ${lesson.duration || 'Unknown'}`}
                    primaryTypographyProps={{
                      variant: 'body2',
                      fontWeight: index === activeLesson ? 'bold' : 'normal'
                    }}
                    secondaryTypographyProps={{
                      variant: 'caption'
                    }}
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CourseVideoPlayer;
