import {CommonModule, NgOptimizedImage} from "@angular/common";
import {Component, inject} from "@angular/core";
import {MatButtonModule} from "@angular/material/button";
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from '@angular/material/dialog';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {PersonaDetailed, User} from "../../../common/types";
import {MatIcon} from "@angular/material/icon";

@Component({
    selector: 'personas-dialog',
    templateUrl: './personas-dialog.html',
    styleUrl: './personas-dialog.scss',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatIcon,
        NgOptimizedImage,
    ],
})
export class PersonasDialog {
    readonly dialogRef = inject(MatDialogRef<PersonasDialog>);
    user = inject<User>(MAT_DIALOG_DATA);
    isLoading = true;
    currentSlideIndex = 0;

    personas: PersonaDetailed[] = [
        {
            id: "visionary",
            name: "The Visionary",
            description: "Description: Craves big ideas and bold futures. Thrives on imaginative worlds and philosophical questions.\n" +
                "Loves: Science fiction, speculative fiction, dystopias, futurism\n" +
                "Tone: Thought-provoking, cerebral, grand in scope",
            image: "assets/visionary.png"
        },
        {
            id: "escapist",
            name: "The Escapist",
            description: "Description: Seeks total immersion in other worlds. Reads to forget reality and dive deep into fantasy and adventure.\n" +
                "Loves: Epic fantasy, high-stakes adventures, magical realism\n" +
                "Tone: Immersive, dramatic, richly detailed",
            image: "assets/escapist.png"
        },
        {
            id: "seeker",
            name: "The Seeker",
            description: "Description: Drawn to stories of identity, spirituality, and inner growth.\n" +
                "Loves: Literary fiction, memoirs, magical realism\n" +
                "Tone: Reflective, poetic, intimate",
            image: "assets/seeker.png"
        },
        {
            id: "analyst",
            name: "The Analyst",
            description: "Description: Loves complex plots, layered characters, and deep analysis. Often reads to solve or understand.\n" +
                "Loves: Mysteries, historical fiction, political thrillers, essays\n" +
                "Tone: Intricate, intellectual, suspenseful",
            image: "assets/analyst.png"
        },
        {
            id: "romantic",
            name: "The Romantic",
            description: "Description: Reads for emotion, connection, and the journey of love.\n" +
                "Loves: Romance (all subgenres), emotional literary fiction\n" +
                "Tone: Heartfelt, dramatic, warm or bittersweet",
            image: "assets/romantic.png"
        },
        {
            id: "rebel",
            name: "The Rebel",
            description: "Description: Attracted to stories that challenge norms, subvert expectations, or feature antiheroes.\n" +
                "Loves: Dystopias, satire, dark fantasy, underground fiction\n" +
                "Tone: Edgy, raw, provocative",
            image: "assets/rebel.png"
        },
        {
            id: "historian",
            name: "The Historian",
            description: "Description: Fascinated by the past and how it echoes in the present.\n" +
                "Loves: Historical fiction, biographies, classics, nonfiction\n" +
                "Tone: Grounded, rich in detail, nostalgic",
            image: "assets/historian.png"
        },
        {
            id: "minimalist",
            name: "The Minimalist",
            description: "Description: Prefers concise prose, clean narratives, and emotional depth in few words.\n" +
                "Loves: Modern lit, short stories, contemporary fiction\n" +
                "Tone: Sparse, elegant, introspective",
            image: "assets/minimalist.png"
        },
        {
            id: "dreamer",
            name: "The Dreamer",
            description: "Description: Loves lyrical writing and whimsical worlds that border on the surreal.\n" +
                "Loves: Magical realism, fairy tales, folklore, abstract fiction\n" +
                "Tone: Imaginative, poetic, otherworldly",
            image: "assets/dreamer.png"
        },
        {
            id: "realist",
            name: "The Realist",
            description: "Description: Drawn to grounded stories about real people and everyday life.\n" +
                "Loves: Contemporary fiction, memoirs, slice-of-life novels\n" +
                "Tone: Honest, relatable, unembellished",
            image: "assets/realist.png"
        },
        {
            id: "thrill_seeker",
            name: "The Thrill Seeker",
            description: "Description: Chases adrenaline through fast-paced narratives, twists, and high stakes.\n" +
                "Loves: Thrillers, horror, crime, survival stories\n" +
                "Tone: Tense, gripping, dark",
            image: "assets/thrill_seeker.png"
        },
        {
            id: "optimist",
            name: "The Optimist",
            description: "Description: Seeks hope, humor, and uplift in their stories — even in the darkest moments.\n" +
                "Loves: Feel-good fiction, coming-of-age, rom-coms\n" +
                "Tone: Uplifting, heartwarming, humorous",
            image: "assets/optimist.png"
        },
        {
            id: "scholar",
            name: "The Scholar",
            description: "Description: Loves intellectually demanding reads and cross-disciplinary themes.\n" +
                "Loves: Philosophy, nonfiction, literary classics, deep sci-fi\n" +
                "Tone: Dense, rich, abstract",
            image: "assets/scholar.png"
        },
        {
            id: "curator",
            name: "The Curator",
            description: "Description: Reads across genres and styles. Loves aesthetics, discovery, and collecting beautiful or rare books.\n" +
                "Loves: Niche fiction, experimental writing, cult classics\n" +
                "Tone: Varied, eclectic, often artistic",
            image: "assets/curator.png"
        },
        {
            id: "strategist",
            name: "The Strategist",
            description: "Description: Engaged by systems, logic, and characters who navigate challenges with skill.\n" +
                "Loves: Hard sci-fi, political dramas, game theory-based fiction\n" +
                "Tone: Methodical, layered, ambitious",
            image: "assets/strategist.png"
        },
    ]

    updateData(newData: User) {
        console.log(newData);
        this.user = newData;
        this.isLoading = false;
    }

    getSlide(): PersonaDetailed {
        const index = this.user.progression ? this.currentSlideIndex - 1 : this.currentSlideIndex;
        const persona = this.user.personas[index];
        return this.personas.find((person) => person.id === persona.id)!;
    }

    previousSlide(): void {
        this.currentSlideIndex--;
    }

    nextSlide(): void {
        this.currentSlideIndex++;
    }

    closeDialog() {
        this.dialogRef.close()
    }
}
