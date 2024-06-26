import { LoadingButton } from "@mui/lab";
import { Box, Button, MenuItem, TextField } from "@mui/material";
import { useSnackbar } from "notistack";
import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import usePainterService from "../../../service/PainterService";
import usePaintingService from "../../../service/PaintingService";

const EditPaintingPage = () => {
  const id = Number(useParams().id);
  const { paintings, updatePainting } = usePaintingService();
  const { painters } = usePainterService();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const painting = paintings.find((p) => p.id === id);

  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);
  const [painterIdStr, setPainterIdStr] = useState(
    painting?.painterId && painting?.painterId >= 0
      ? painting.painterId.toString()
      : "-1"
  );

  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = nameRef.current?.value || "";
    const description = descriptionRef.current?.value || "";
    const year = parseInt(yearRef.current?.value || "0", 10);
    const painterId = parseInt(painterIdStr, 10);

    if (!painting?.id) throw new Error("Painting not found");

    setIsUpdating(true);
    try {
      await updatePainting({
        id: painting.id,
        name,
        description,
        year,
        painterId,
      });
      enqueueSnackbar("Painting added successfully", {
        variant: "success",
      });
      navigate("/paintings");
    } catch (error) {
      enqueueSnackbar("Failed to add painting", {
        variant: "error",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Box
      sx={{
        "& button, & .MuiTextField-root": { m: 1 },
      }}
    >
      {!painting ? (
        "Painting not found!"
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <TextField
              variant="outlined"
              label="Name"
              inputRef={nameRef}
              defaultValue={painting.name}
            />
          </div>
          <div>
            <TextField
              variant="outlined"
              label="Description"
              inputRef={descriptionRef}
              defaultValue={painting.description}
            />
          </div>
          <div>
            <TextField
              variant="outlined"
              label="Year"
              type="number"
              inputRef={yearRef}
              defaultValue={painting.year.toString()}
            />
          </div>
          <div>
            <TextField
              select
              label="Painter"
              sx={{ width: 222 }}
              value={painterIdStr}
              onChange={(e) => setPainterIdStr(e.target.value)}
            >
              <MenuItem key={-1} value={-1}>
                {"(None)"}
              </MenuItem>
              {painters.map((painter) => (
                <MenuItem key={painter.id} value={painter.id}>
                  {painter.name}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isUpdating}
            >
              Save
            </LoadingButton>
          </div>
        </form>
      )}
      <div>
        <Button
          variant="outlined"
          disabled={isUpdating}
          onClick={() => navigate("/paintings")}
        >
          Cancel
        </Button>
      </div>
    </Box>
  );
};

export default EditPaintingPage;
