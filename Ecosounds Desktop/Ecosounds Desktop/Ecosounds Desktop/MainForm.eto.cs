using System;
using Eto.Forms;
using Eto.Drawing;
using System.Collections.Generic;

namespace Ecosounds_Desktop
{
    public class MyCommand : Command
    {
        public MyCommand()
        {
            MenuText = "Click Me, Command";
            ToolBarText = "Click Me";
            ToolTip = "This shows a dialog for no reason";
            Shortcut = Application.Instance.CommonModifier | Keys.M; //Ctrl+M or cmd+M
        }

        protected override void OnExecuted(EventArgs e)
        {
            base.OnExecuted(e);
            MessageBox.Show(Application.Instance.MainForm, "You clicked me!", "Title", MessageBoxButtons.OK);
        }
    }

    partial class MainForm : Form
    {
        /// <summary>
        /// Converts 256 value rgb inputs into Color
        /// </summary>
        /// <param name="r">Red</param>
        /// <param name="g">Green</param>
        /// <param name="b">Blue</param>
        /// <returns>Color</returns>
        private Color RGBColor(float r, float g, float b)
        {
            return new Color(r / 256f, g / 256f, b / 256f);
        }

        /// <summary>
        /// Displays analysis inputs
        /// </summary>
        private DynamicLayout Analysis()
        {
            var container = new DynamicLayout();
            container.ID = "AnalysisContainer";
            container.Padding = new Padding(5);
            container.BeginHorizontal();
            
            var selectAnalysisLabel = new Label { Text = "Select Analysis Types", Style = "header" };
            var analysisTypesTable = new TableLayout
            {
                Padding = new Padding(20, 5),
                Spacing = new Size(5, 5),
                Rows = {
                    new TableRow(
                        new TableCell(new CheckBox{ Text = "AED", Enabled = false}, true),
                        new TableCell(new CheckBox{ Text = "Audio to CSV" }, true),
                        new TableCell(new CheckBox{ Text = "Audio 2 Sonogram" , Enabled = false}, true)
                        ),
                    new TableRow(
                        new TableCell(new CheckBox{ Text = "Indicies CSV to Image" , Enabled = false}, true),
                        new TableCell(new CheckBox{ Text = "Oscillations Generic" , Enabled = false}, true),
                        new TableCell(new CheckBox{ Text = "Event Recogniser"}, true)
                        )
                }
            };

            container.AddRow(selectAnalysisLabel);
            container.AddRow(analysisTypesTable);

            #region Audio File Selection
            var audioPanel = new DynamicLayout();
            audioPanel.ID = "AudioPanel";

            audioPanel.BeginHorizontal();

            var selectFilesLabel = new Label { Text = "Select Audio Files ", Style = "header" };
            audioPanel.AddRow(selectFilesLabel);

            audioPanel.EndHorizontal();
            #endregion

            container.AddRow(audioPanel);
            container.EndBeginHorizontal();

            return container;
        }

        void InitializeComponent()
        {
            this.ClientSize = new Size(600, 400);
            this.Title = "Ecosounds Desktop";

            var titleColor = RGBColor(34f, 34f, 34f);
            var highlightColor = RGBColor(2f, 2f, 2f);

            Eto.Style.Add<Label>("title", label =>
            {
                label.Font = new Font(FontFamilies.Sans, 14);
                label.Size = new Size(130, 50);
                label.BackgroundColor = titleColor;
                label.TextColor = Colors.LightGrey;
                label.TextAlignment = TextAlignment.Center;
                label.VerticalAlignment = VerticalAlignment.Center;
            });
            Eto.Style.Add<Label>("title-button", label =>
            {
                label.Font = new Font(FontFamilies.Sans, 12);
                label.Size = new Size(80, 50);
                label.BackgroundColor = titleColor;
                label.TextColor = Colors.LightGrey;
                label.TextAlignment = TextAlignment.Center;
                label.VerticalAlignment = VerticalAlignment.Center;
                label.Cursor = Cursors.Pointer;
            });
            Eto.Style.Add<Label>("title-button-selected", label =>
            {
                label.Font = new Font(FontFamilies.Sans, 12);
                label.Size = new Size(80, 50);
                label.BackgroundColor = highlightColor;
                label.TextColor = Colors.LightGrey;
                label.TextAlignment = TextAlignment.Center;
                label.VerticalAlignment = VerticalAlignment.Center;
                label.Cursor = Cursors.Pointer;
            });
            Eto.Style.Add<Label>("header", label =>
            {
                label.Font = new Font(FontFamilies.Sans, 12);
                label.TextAlignment = TextAlignment.Left;
                label.VerticalAlignment = VerticalAlignment.Center;
            });

            var filler = new Label { BackgroundColor = titleColor };

            var container = new DynamicLayout();

            container.BeginVertical(); //Header

            var title = new Label { Text = "Ecosounds", Style = "title" };
            var analysis = new Label { Text = "Analysis", Style = "title-button-selected" };
            var visualise = new Label { Text = "Visualise", Style = "title-button" };
            var utilities = new Label { Text = "Utilities", Style = "title-button" };
            container.AddRow(title, analysis, visualise, utilities, filler);

            container.EndBeginVertical();

            container.AddRow(Analysis());

            Content = new Scrollable
            {
                Content = container
            };
        }
    }
}
