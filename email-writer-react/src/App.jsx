import React, { useState } from "react";
import axios from "axios";
import Select from "@mui/material/Select";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Container,
  Card,
  Switch,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./App.css";

const App = () => {
  const [emailContent, setEmailContent] = useState("");
  const [tone, setTone] = useState("");
  const [generatedReply, setGeneratedReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:8080/api/email/generate", {
        emailContent,
        tone,
      });
      setGeneratedReply(
        typeof response.data === "string"
          ? response.data
          : JSON.stringify(response.data)
      );
    } catch (error) {
      setError("Failed to generate email reply. Please try again");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: "#FF9AA2" },
      secondary: { main: "#A2D8FF" },
      background: {
        background: {
          default: darkMode ? "#1E1E1E" : "#FAF3DD", // Floral Pastel Yellow
          paper: darkMode ? "#121212" : "#FAF3DD", // Floral Pastel Yellow
        },        
      },
      text: { primary: darkMode ? "#FFFFFF" : "#5F5A6C" },
    },
    typography: {
      fontFamily: "'Comic Sans MS', cursive, sans-serif",
      h4: {
        fontWeight: 700,
        fontSize: "1.8rem",
        textAlign: "center",
      },
      body1: { fontSize: "1rem", lineHeight: 1.5 },
      button: { textTransform: "none", fontSize: "1rem" },
    },
    shape: { borderRadius: 20 },
  });

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth="md"
        sx={{
          py: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: darkMode ? "#121212" : "", // Floral Pastel Yellow

          transition: "all 0.4s ease-in-out",
        }}
      >
        <Card
          sx={{
            p: 5,
            borderRadius: "20px",
            boxShadow: darkMode
              ? "0px 4px 15px rgba(0, 0, 0, 0.6)"
              : "0px 4px 15px rgba(0, 0, 0, 0.1)",
            maxWidth: "600px",
            width: "100%",
            background: darkMode ? "#1E1E1E" : "#B3CEE5", // Floral Pastel Yellow

            textAlign: "center",
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="h4">📩 Email Reply Generator 📩</Typography>
            <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
          </Box>

          <Box sx={{ mx: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={6}
              variant="outlined"
              label="Original Email Content"
              value={emailContent || ""}
              onChange={(e) => setEmailContent(e.target.value)}
              sx={{
                mb: 2,
                bgcolor: darkMode ? "#2E2E2E" : "white", // Floral Pastel Yellow

                borderRadius: "10px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: darkMode ? "#A2D8FF" : "#FF9AA2",
                  },
                  "&:hover fieldset": {
                    borderColor: darkMode ? "#FF9AA2" : "#A2D8FF",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: darkMode ? "#FF9AA2" : "#A2D8FF",
                  },
                },
              }}
            />

            {/* Tone (Optional) - Added "Select a Tone" Popup */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography sx={{ pr: 1, fontWeight: "bold", color: darkMode ? "#FFFFFF" : "#5F5A6C" }}>
                Tone (Optional):
              </Typography>
              <FormControl sx={{ flex: 1 }}>
                <Select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  displayEmpty
                  sx={{
                    bgcolor: darkMode ? "#2E2E2E" : "#FFFDF9",
                    borderRadius: "10px",
                    width: "100%",
                    minHeight: "45px",
                  }}
                >
                  <MenuItem value="" disabled>
                    Select a Tone
                  </MenuItem>
                  <MenuItem value="None">None</MenuItem>
                  <MenuItem value="Professional">Professional</MenuItem>
                  <MenuItem value="Casual">Casual</MenuItem>
                  <MenuItem value="Friendly">Friendly</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!emailContent || loading}
              fullWidth
              sx={{
                backgroundColor: "#FF9AA2",
                borderRadius: "10px",
                "&:hover": { backgroundColor: "#FFB5C2" },
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Generate Reply"}
            </Button>
          </Box>

          {error && (
            <Typography sx={{ mt: 2, textAlign: "center", color: darkMode ? "#FF6B6B" : "#D32F2F" }}>
              {error}
            </Typography>
          )}

          {generatedReply && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Generated Reply
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={6}
                variant="outlined"
                value={generatedReply || ""}
                inputProps={{ readOnly: true }}
                sx={{
                  bgcolor: darkMode ? "#2E2E2E" : "#FFFDF9",
                  borderRadius: "10px",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: darkMode ? "#A2D8FF" : "#FF9AA2",
                    },
                  },
                }}
              />

              <Button
                variant="outlined"
                sx={{
                  mt: 2,
                  borderColor: "#FF9AA2",
                  borderRadius: "10px",
                  "&:hover": { backgroundColor: "#FFB5C2", color: "white" },
                }}
                onClick={() => navigator.clipboard.writeText(generatedReply)}
              >
                Copy to Clipboard
              </Button>
            </Box>
          )}
        </Card>
      </Container>
    </ThemeProvider>
  );
};

export default App;
