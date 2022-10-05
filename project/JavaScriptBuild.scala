import sbt.Keys._
import sbt.{Def, _}

object JavaScriptBuild {
  val configDirectory = SettingKey[File]("configDirectory")
  val runAllTests = TaskKey[Int]("runAllTests")
  val npmInstall = TaskKey[Int]("npm-install")
  val bundleJs = TaskKey[Int]("bundleJs")

  private def runOperation(operation: String, result: Int): Int = {
    if (result != 0) {
      throw new Exception(s"$operation failed with result $result")
    }
    result
  }


  lazy val javaScriptBundler: Seq[sbt.Def.Setting[_]] = {

    Seq(

      configDirectory := {
        Compile / baseDirectory
      }.value,

      npmInstall := runOperation("npm install", Gulp.npmProcess(configDirectory.value, "install").run().exitValue()),


      bundleJs := runOperation("JS bundling", Gulp.gulpProcess(configDirectory.value, "build").run().exitValue()),
      bundleJs := {
        bundleJs dependsOn npmInstall
      }.value,

      (Compile / compile) := {
        (Compile / compile) dependsOn bundleJs
      }.value
    )
  }


}
